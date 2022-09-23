#include "OrderBook.h"
#include "CSVReader.h"

/** Create orderbook from the contents of the CSV file
 * @param fileName filename of the CSV file
 */
Orderbook::Orderbook(const std::string fileName)
{
    _orderbook = CSVReader::transformCSV(fileName);
};

/** Get container stored at specified day key
 * @param dayStr string for the day name
 * @return reference to the daydata object
 */
DayData &Orderbook::getDayPage(const std::string dayStr)
{
    // Try to get requested day page
    try
    {
        return _orderbook.at(dayStr);
    }
    // If there is no page available
    catch (const std::exception &e)
    {
        // Report error
        std::cerr << "Orderbook::getDayPage - Error! Can't find requested page! ("
                  << e.what() << ").\n";
        throw;
    }
};

/* Prints whole orderbook */
void Orderbook::printOrderbook()
{
    // Iterate over all days
    for (auto &[dayStr, dayData] : _orderbook)
    {
        // Print day page information
        std::cout << "Date: " << dayStr << " {\n";
        dayData.printDayPage();
        std::cout << "  }\n";
    }
};

/** Function to get all known products in orderbook
 * @return vector of strings - all existing products from the orderbook
 * */
std::set<std::string> Orderbook::getAllProducts()
{
    // All products from this orderbook
    std::set<std::string> products;

    // Iterate over all day pages
    for (auto &[dayStr, dayGrp] : _orderbook)
    {
        // For each day page, get all products and add them to the resulting set
        products.merge(dayGrp.getDayProducts());
    }

    // Return the products list
    return products;
};

/** Get minimum order price for the requested product in the current day-time
 * @param day string representation of the day
 * @param time string representation of the timestamp
 * @param product string representation of the product
 * @param ordertype reference to the ordertype object
 * @return Minimal price of the order with specified params
 * */
double Orderbook::getCurMin(const std::string day,
                            const std::string time,
                            const std::string product,
                            const OrderType &ordertype)
{
    // Try to get requested info
    return _orderbook[day]
        .getTimestampPage(time)
        .getProductPage(product)
        .getOrdertypePage(ordertype)
        .getMin();
};

/** Get maximum order price for the requested product in the current day-time
 * @param day string representation of the day
 * @param time string representation of the timestamp
 * @param product string representation of the product
 * @param ordertype reference to the ordertype object
 * @return Maximum price of the order with specified params
 * */
double Orderbook::getCurMax(const std::string day,
                            const std::string time,
                            const std::string product,
                            const OrderType &ordertype)
{
    // Try to get requested info
    return _orderbook[day]
        .getTimestampPage(time)
        .getProductPage(product)
        .getOrdertypePage(ordertype)
        .getMax();
};

/** Get average price for specified product across several timestamps */
double Orderbook::getRangeAvg(const std::string prod,
                              const OrderType &OTP,
                              const unsigned int steps)
{
    // Counter variable
    unsigned int i = 1;

    // Result variable
    double result = 0;

    // Variable to collect total orders amount
    double totalAmount = 0;

    // Iterate over orderbook
    for (auto &[dayStr, dayPage] : _orderbook)
    {
        // Iterate over all timestams from the date
        for (auto &[timeStr, timePage] : dayPage.getDailyOrders())
        {
            // Check that requested product exists in this timestamp
            if (timePage.checkProductPage(prod))
            {
                // For this timestamp check requested order type
                if (timePage.getProductPage(prod).checkOrdertypePage(OTP))
                {
                    // Orders container
                    OrdertypeGroup orders = timePage.getProductPage(prod).getOrdertypePage(OTP);

                    // Sum up total value
                    result += orders.getAvg() * orders.getTtlVol();

                    // Sum up total number of order
                    totalAmount += orders.getTtlVol();
                }
            }

            // Stop if counter reach the timestamp limit
            if (i == steps)
            {
                // If there are were at least one order -> return average, else return 0
                return totalAmount != 0 ? result / totalAmount : 0;
            }

            // Increment counter for each passed stamp
            ++i;
        }
    }
    return 0;
};

/** Predict requested order price for the next period
 * @param extrema requested price extrema to predict - min or max
 * @param prod string representation of the product
 * @param OTP reference to the ordertype object
 * @param extrema current time pair: date - first, timestamp - second
 * @return prediction for the requested price
 */
double Orderbook::getPrediction(const std::string extrema,
                                const std::string prod,
                                const OrderType &OTP,
                                const std::pair<std::string, std::string> curDateTime)
{
    /* To be honest I'm didn't find how moving weighted average should work
    if there is empty period inside, so I decided to add weight based not on the time lag
    but increase weight for each non-empty period. It's also works fine if there is no
    gaps in data */

    // Result variable
    double predict = 0;

    // Period weight
    unsigned int perWeight = 0;

    // Iterate over all days
    for (auto &[dayStr, dayPage] : _orderbook)
    {
        // Iterate over all timestamps
        for (auto &[timeStr, timePage] : dayPage.getDailyOrders())
        {
            // Check that requested product exists in this timestamp
            if (timePage.checkProductPage(prod))
            {
                // For this timestamp check requested order type
                if (timePage.getProductPage(prod).checkOrdertypePage(OTP))
                {
                    // Orders container
                    OrdertypeGroup orders = timePage.getProductPage(prod).getOrdertypePage(OTP);

                    // Adjust weight variable for the next period
                    ++perWeight;

                    // Add requested period price multiplied by the weight to the result
                    predict +=
                        extrema == "min" ? orders.getMin() : orders.getMax() * perWeight;
                }
            }

            // If reached current (last) timestep
            if (curDateTime.first == dayStr && curDateTime.second == timeStr)
            {
                // Return weighted moving average
                return (predict * 2) /
                       (perWeight * (perWeight + 1));
            }
        }
    }

    // If for some reason arg timestamp is out of range (and to make compiler happy)
    return 0;
};

/** Get all date-time information
 * @return Collection of pairs: date string -> set of associated timestamps(strings)
 */
std::map<std::string,
         std::vector<std::string>>
Orderbook::getAllDatetime()
{
    // Collection container
    std::map<std::string,
             std::vector<std::string>>
        dateTimes;

    // Iterate over all dates in the orderbook
    for (auto iterator = _orderbook.begin(); iterator != _orderbook.end(); ++iterator)
    {
        // Get timestamps vector for the date
        std::vector<std::string> timestamps = (iterator->second).getTimestamps();

        // Add day - timestamps pair to the collections
        dateTimes.insert({iterator->first, timestamps});
    }

    return dateTimes;
};

/** Get the number of timestamps across all the dates
 * @return number of timestamps across all days
 */
unsigned int Orderbook::getTimestepsNum()
{
    // Result variable
    unsigned int res = 0;

    // Iterate over all dates and count timestamps
    for (auto &[day, timestamps] : getAllDatetime())
    {
        res += timestamps.size();
    }

    // Return result
    return res;
};

/** Get earliest date and timestamp from the orderbook
 * @return pair of values: date -> first, timestamp -> second
 */
std::pair<std::string, std::string> Orderbook::getInitialDatetime()
{
    // Get first day - timestamps pair using iterator to select first pair
    auto date1 = getAllDatetime();

    // Prepare result
    std::pair<std::string, std::string> res;
    // Setup values
    res.first = (date1.begin())->first;
    res.second = ((date1.begin())->second)[0];

    // Return dateTime;
    return res;
};

/** Check that argument passed is exists in the book
 * @param prodArg product name string
 * @return true if product exists in the orderbook, false otherwise
 */
bool Orderbook::checkProdArg(const std::string prodArg)
{
    // If product exists return 1 (true), else return 0 (false)
    return getAllProducts().count(prodArg);
};

/** Check that ordertype argument is correct
 * @param ordtypeArg ordertype to check
 * @return true if correct argument value is passed, false otherwise
 */
bool Orderbook::checkOTPArg(const OrderType &ordtypeArg)
{
    return (ordtypeArg != OrderType::unknown);
};

/** Check that timestamp argument is correct
 * @param timestepsArg number of timesteps for the command to handle
 * @return true if orderbook holds  requested number of periods and arg > 0, false otherwise
 */
bool Orderbook::checkTimestampArg(const unsigned int timestepsArg)
{
    return (timestepsArg <= getTimestepsNum() && timestepsArg > 0);
};

/** Check that timestamp argument is correct
 * @param dateArg date to collect data from the orderbook
 * @return true if orderbook holds  requested date, false otherwise
 */
bool Orderbook::checkDateArg(const std::string dateArg)
{
    return getAllDatetime().count(dateArg);
};

/** Check that date holds required number of timestamps */
bool Orderbook::checkStampsInDate(const std::string dateArg,
                                  const unsigned int timestepsArg)
{
    return (timestepsArg <= _orderbook
                                .at(dateArg)
                                .getTimestamps()
                                .size() &&
            timestepsArg > 0);
};

/** Check that order extrema argument is correct
 * @param extremArg requested order extrema
 * @return true if corrected value is passed, false otherwise
 */
bool Orderbook::checkExtremaArg(const std::string extremArg)
{
    return (extremArg == "min" || extremArg == "max");
};

/** Move to the next time stamp (OR day)
 * @param date current date string
 * @param time current timestamp string
 * @return pair of values: date and timestamp
 */
std::pair<std::string, std::string> Orderbook::nextPeriod(const std::string date,
                                                          const std::string time)
{
    // Get all known date-times
    std::map<std::string, std::vector<std::string>> datetimes = getAllDatetime();

    // Prepare variables to be returned
    std::string newDate, newTime;

    // Check if the timestamp is the last in the day
    if (time == datetimes[date].back())
    {
        // If day is also last one
        if (date == datetimes.rbegin()->first)
        {
            // New date is the initial one
            newDate = datetimes.begin()->first;
        }
        // There are other dates
        else
        {
            // Because maps are sorted by default -> point to the next day
            newDate = datetimes.upper_bound(date)->first;
        }

        // New timestamp is the first one
        newTime = datetimes[newDate][0];
    }
    // There are other timestamps left in this date
    else
    {
        // Date is the same
        newDate = date;
        // Iterate over timestamps
        for (unsigned int i = 0; i < datetimes[date].size(); ++i)
        {
            // Find index of the current timestamp
            if (datetimes[date][i] == time)
            {
                // New time is the next stamp
                newTime = datetimes[date][i + 1];
            }
        }
    }

    // Return new period
    return std::make_pair(newDate, newTime);
};

/** Collect adresses of the order type pages for requested product for passed date,
 * from first timestamp to current one (inclusive)
 *
 *  @param curDate current date string, will be used as search base
 *  @param curTime current timestamp string, will be used as end point
 *  @param prod required product
 *  @param OTP required ordertype
 *  @param exclusive flag, to exclude the current timestamp from the result, default false
 *  @return vector of pointers to order type group pages, that satisfy required conditions
 */
std::vector<OrdertypeGroup *> Orderbook::collectOrdTypPages(const std::string curDate,
                                                            const std::string curTime,
                                                            const std::string prod,
                                                            const OrderType &OTP)
{
    // Prepare vector of pointers
    std::vector<OrdertypeGroup *> result;

    // Get all timestamps for the current date
    std::vector<std::string> timestamps = _orderbook.at(curDate).getTimestamps();

    // Iterate over all timestamps
    for (const std::string timestamp : timestamps)
    {
        // This loop continues a lot of 'continue' cmds, so we stop when we past cur time(not when we reach)
        if (timestamp > curTime)
            break;

        // If there are no orders for requested product -> skip to the next timestamp
        if (!_orderbook.at(curDate).getTimestampPage(timestamp).checkProductPage(prod))
            continue;

        // If product page exists, but no ordertype page -> skip timestamp
        if (!_orderbook
                 .at(curDate)
                 .getTimestampPage(timestamp)
                 .getProductPage(prod)
                 .checkOrdertypePage(OTP))
            continue;

        // If requested ordertype page exists
        OrdertypeGroup &container = _orderbook
                                        .at(curDate)
                                        .getTimestampPage(timestamp)
                                        .getProductPage(prod)
                                        .getOrdertypePage(OTP);

        //  If it is not empty -> add address to the vector
        if (!container.isEmpty())
            result.push_back(&container);
    }

    // Return resulting vector
    return result;
}

/** Match all orders within required date and between initial timestamp and required one (inclusive)
 * @param date date to match orders
 * @param timestamp right limit point of the matching interval
 */
void Orderbook::matchOrders(const std::string date, const std::string timestamp)
{
    // Get all products for the current date-time
    std::set<std::string> products = _orderbook
                                         .at(date)
                                         .getTimestampPage(timestamp)
                                         .getProductKeys();

    // Iterate over every product
    for (const std::string product : products)
    {
        // Prepare pointers for bids and asks
        OrdertypeGroup *bids = nullptr;
        OrdertypeGroup *asks = nullptr;

        // Product page object
        ProductPage &prodPage = _orderbook
                                    .at(date)
                                    .getTimestampPage(timestamp)
                                    .getProductPage(product);

        // Check that bids exist
        if (prodPage.checkOrdertypePage(OrderType::bid))
        {
            // Bid page object
            OrdertypeGroup &bidPage = _orderbook
                                          .at(date)
                                          .getTimestampPage(timestamp)
                                          .getProductPage(product)
                                          .getOrdertypePage(OrderType::bid);

            // Check that ordertype page is not empty
            if (!bidPage.isEmpty())
            {
                // Set pointer to the ordertype page
                bids = &bidPage;

                // Sort bids in descending order
                (*bids).sortOrdPrDes();
            }
        }

        // Check that asks exist
        if (prodPage.checkOrdertypePage(OrderType::ask))
        {
            // Ask page object
            OrdertypeGroup &askPage = _orderbook
                                          .at(date)
                                          .getTimestampPage(timestamp)
                                          .getProductPage(product)
                                          .getOrdertypePage(OrderType::ask);

            // Check that ordertype page is not empty
            if (!askPage.isEmpty())
            {
                // Get current period bids
                asks = &_orderbook
                            .at(date)
                            .getTimestampPage(timestamp)
                            .getProductPage(product)
                            .getOrdertypePage(OrderType::ask);

                // Sort bids in ascending order
                (*asks).sortOrdPrAsc();
            }
        }

        // Prepare vector of bids to match
        auto bidsToMatch = collectOrdTypPages(date, timestamp, product, OrderType::bid);
        auto asksToMatch = collectOrdTypPages(date, timestamp, product, OrderType::ask);

        // Match if there are something to match
        if (bidsToMatch.size() != 0 && asksToMatch.size() != 0)
        {
            // Add sale orderTypeGroup to this product page if orderTypeGroup count != 0
            OrdertypeGroup sales = OrdertypeGroup::matchVectors(asksToMatch, bidsToMatch);

            // If sales have orders ->
            if (!sales.isEmpty())
            {
                // Add them to the product list
                prodPage.addOrdertypeGroup(OrderType::sale, sales);
            }
        }
    }
};

/** Print all sales from the requested period
 * @param date date of the period to check sales
 * @param timestamp timestamp of the period to check sales
 */
void Orderbook::printSales(const std::string date, const std::string timestamp)
{
    try
    {
        // Get date-time container
        TimestampPage container = _orderbook.at(date).getTimestampPage(timestamp);

        unsigned int total = 0;

        // Iterate over all product names (from this container)
        for (std::string prodName : container.getProductKeys())
        {
            // If there is sales page
            if (container.getProductPage(prodName).checkOrdertypePage(OrderType::sale))
            {
                // Get the number of product sales
                unsigned int prodSales = container
                                             .getProductPage(prodName)
                                             .getOrdertypePage(OrderType::sale)
                                             .getOrdCnt();

                // Increase total sales number
                total += prodSales;

                // Print product sales
                std::cout
                    << "Number of sales for " << prodName
                    << " is " << prodSales << ".\n";
            }
        }

        // Print total sales
        std::cout
            << "Total number of sales for the " << date << " - " << timestamp
            << " is " << total << ".\n\n";
    }
    // Can't get requested container
    catch (const std::exception &e)
    {
        // Error msg
        std::cerr << "Can't find requested period! Please try another one.\n\n";
    }
};

/** Print the market data in the form of the depth data graph
 * @param date date of the period to check orders
 * @param prod product to visualize orders
 * @param steps number of timesteps for the selected date to collect data
 */
void Orderbook::marketDepthChart(const std::string date,
                                 const std::string product,
                                 const unsigned int steps)
{
    // Number of columns and rows
    const unsigned int columns = 80;
    const unsigned int rows = 10;

    // Result variable
    std::vector<double> result(columns + 1, 0);

    // Get all timestamps for the time range
    std::vector<std::string> timestamps = _orderbook.at(date).getTimestamps();

    // Prepare vector of pointers to all applicable bid group pages
    auto allBids = collectOrdTypPages(date, timestamps[steps - 1], product, OrderType::bid);

    // Prepare vector of pointers to all applicable ask group pages
    auto allAsks = collectOrdTypPages(date, timestamps[steps - 1], product, OrderType::ask);

    // If there are no data at all -> throw an error to a caller to handle
    if (allAsks.empty() && allBids.empty())
        throw(std::invalid_argument("Plot function error - No orders for the requested product in the requested timestamp(s)!"));

    // Get data about X - axis
    std::map<std::string, double> xInfo = getXinfo(allAsks, allBids, columns);

    // If there are single order -> throw an error to a caller to handle
    if (xInfo.at("col") == 0)
        throw(std::invalid_argument("Plot function error - Single order, nothing to plot!"));

    // Sort all ask orders into buckets
    std::vector<double> askBucket = allPagesToBuckets(allAsks,
                                                      xInfo.at("min"),
                                                      xInfo.at("col"), columns);

    // Sort all bid orders into buckets
    std::vector<double> bidBucket = allPagesToBuckets(allBids,
                                                      xInfo.at("min"),
                                                      xInfo.at("col"), columns);

    // Get data about Y - axis
    std::map<std::string, double> yInfo = getYinfo(askBucket, bidBucket, rows);

    // Prepare the graph based on all the data
    std::string graph = plodData(askBucket, bidBucket, rows, columns,
                                 xInfo.at("min"), xInfo.at("max"), xInfo.at("col"),
                                 yInfo.at("min"), yInfo.at("max"), yInfo.at("row"));

    // Print the graph
    std::cout << graph << '\n';
};

/** Get required information about X - axis of the chart
 * @param asks vector of pointers to all suitable ask pages
 * @param bids vector of pointers to all suitable bid pages
 * @param columns number of columns in the graph
 * @return map containing values of "min" price, "max" price, and single column "col" value
 */
std::map<std::string, double> Orderbook::getXinfo(std::vector<OrdertypeGroup *> &asks,
                                                  std::vector<OrdertypeGroup *> &bids,
                                                  const unsigned int columns)
{
    // Declare result variable containing information about x axis
    std::map<std::string, double> xInfo;

    // Initialize price range variables
    double maxBid = 0, maxAsk = 0, minBid = 0, minAsk = 0;

    // Calculate bid spread
    std::pair<double, double> bidSpread = OrdertypeGroup::getPriceSpread(bids);

    // Set max and min values for bid
    maxBid = bidSpread.first;
    minBid = bidSpread.second;

    // Calculate ask spread
    std::pair<double, double> askSpread = OrdertypeGroup::getPriceSpread(asks);

    // Set max and min values for ask
    maxAsk = askSpread.first;
    minAsk = askSpread.second;

    // If graph has both asks and bids
    if (!asks.empty() && !bids.empty())
    {
        // Add to the result: min, max
        xInfo.insert({"min", std::min(minBid, minAsk)});
        xInfo.insert({"max", std::max(maxBid, maxAsk)});
    }
    // If graph has only bids
    else if (asks.empty())
    {
        // Add to the result: min, max
        xInfo.insert({"min", minBid});
        xInfo.insert({"max", maxBid});
    }
    // If graph has only asks
    else if (bids.empty())
    {
        // Add to the result: min, max
        xInfo.insert({"min", minAsk});
        xInfo.insert({"max", maxAsk});
    }

    // Add to the result -> value of the single column
    xInfo.insert({"col", (xInfo["max"] - xInfo["min"]) / columns});

    // Return axis info
    return xInfo;
};

/** Get required information about Y - axis of the chart
 * @param askBuckets vector of buckets containing amount values of ask orders
 * @param bidBuckets vector of buckets containing amount values of bid orders
 * @param rows number of rows in the graph
 * @return map containing values of "min" amoint, "max" amoint, and single row "row" value
 */
std::map<std::string, double> Orderbook::getYinfo(std::vector<double> &askBuckets,
                                                  std::vector<double> &bidBuckets,
                                                  const unsigned int rows)
{
    // Declare result variable containing information about y axis
    std::map<std::string, double> yInfo;

    // Initialize amount range variables
    double maxBid = 0, maxAsk = 0, minBid = 0, minAsk = 0;

    // Calculate bid spread
    std::pair<double, double> bidSpread = OrdertypeGroup::getAmountSpread(bidBuckets);

    // Set max and min values for bid
    maxBid = bidSpread.first;
    minBid = bidSpread.second;

    // Calculate ask spread
    std::pair<double, double> askSpread = OrdertypeGroup::getAmountSpread(askBuckets);

    // Set max and min values for ask
    maxAsk = askSpread.first;
    minAsk = askSpread.second;

    // Set y info: min and max amounts, and value of the single row
    yInfo.insert({"min", std::min(minBid, minAsk)});
    yInfo.insert({"max", std::max(maxBid, maxAsk)});
    yInfo.insert({"row", (yInfo["max"] - yInfo["min"]) / rows});

    // Return axis info
    return yInfo;
};

/** Prepare yAxis data to add to the plot based on the row index */
std::string Orderbook::yAxisRowData(const double yMax,
                                    const double yMin,
                                    const double yRow,
                                    const int ind)
{
    // Prepare result variable
    std::string result = "";

    // Length of the max amount value
    unsigned int yValMaxLen = std::to_string(yMax).size();

    // Low boundary of the amount range (row)
    double lowBound = (yMin + (yRow * ind));

    // Amount value for the current row (highest boundary)
    double highBound = (yMin + (yRow * (ind + 1)));

    // Stringify amount value
    std::string highBoundStr = std::to_string(highBound);

    // Even rows with values, odd - empty
    if (ind % 2 == 0)
        result = highBoundStr;
    else
        result = std::string(yValMaxLen - result.size(), ' ');

    // If value is too short, add some whitespaces to even out all values
    if (highBoundStr.size() < yValMaxLen)
    {
        result = result + std::string(yValMaxLen - result.size(), ' ');
    }

    return result;
};

/** Build the graph from ask and bid buckets and return it in the form of the string
 * @param askBucket vector of buckets containing amount values of ask orders
 * @param bidBucket vector of buckets containing amount values of bid orders
 * @param rows number of rows in the plot
 * @param columns number of columns in the plot
 * @param xMin minimum price bucket value
 * @param xMax maximum price bucket value
 * @param xStep price difference of the single column
 * @param yMin minimum amount value of the orders in the bucket
 * @param yMax minimum amount value of the orders in the bucket
 * @param yStep amount difference of the single row
 * @return market depth data visualised in the form of the string
 */
std::string Orderbook::plodData(const std::vector<double> &askBucket,
                                const std::vector<double> &bidBucket,
                                const unsigned int rows,
                                const unsigned int columns,
                                const double xMin,
                                const double xMax,
                                const double xStep,
                                const double yMin,
                                const double yMax,
                                const double yStep)
{
    // Prepare graph
    std::string graph = "";

    // Prepare variable to calculate yAxis data field length
    unsigned int xAxisOffset = 0;

    // Iterate for every row
    for (int i = (rows - 1); i >= 0; --i)
    {
        // Prepare row
        std::string row = "";

        // Low boundary of the amount range (row)
        double lowBound = yMin + yStep * i;

        // Prepare yAxis Value consisting from the data and offset
        std::string yAxisValue = yAxisRowData(yMax, yMin, yStep, i) + "   |";

        // Save the size of the yAxis value as offset for the xAxis
        xAxisOffset = yAxisValue.size();

        // Add yAxis value to row
        row += yAxisValue;

        // Different char sets
        // (https://stackoverflow.com/questions/24281603/c-underline-output)
        char normal[] = {0x1b, '[', '0', ';', '3', '9', 'm', 0};
        char green[] = {0x1b, '[', '0', ';', '3', '2', 'm', 0};
        char yellow[] = {0x1b, '[', '0', ';', '3', '3', 'm', 0};
        char blue[] = {0x1b, '[', '0', ';', '3', '4', 'm', 0};
        char undrLineGreen[] = {0x1b, '[', '4', ';', '3', '2', 'm', 0};
        char undrLineYellow[] = {0x1b, '[', '4', ';', '3', '3', 'm', 0};
        char undrLineBlue[] = {0x1b, '[', '4', ';', '3', '4', 'm', 0};

        // Iterate for every column
        for (unsigned int j = 0; j <= columns; ++j)
        {
            // If there are both ask and bid orders in this price range
            if (bidBucket[j] > lowBound && askBucket[j] > lowBound)
            {
                // If not last row -> just add colored
                if (i != 0)
                {
                    // Mark with cross (we add color, char and then return color)
                    row += yellow;
                    row += "X";
                    row += normal;
                }
                // Else, colored and underlined
                else
                {
                    // Mark with colored and underlined cross
                    row += undrLineYellow;
                    row += "X";
                    row += normal;
                }
            }
            // If there are only bid orders in this price range
            else if (bidBucket[j] > lowBound)
            {
                // If not last row -> just add colored
                if (i != 0)
                {
                    // Mark with backslash (bids are on the left)
                    row += green;
                    row += "\\";
                    row += normal;
                }
                // Else, colored and underlined
                else
                {
                    // Mark with colored and underlined backslah
                    row += undrLineGreen;
                    row += "\\";
                    row += normal;
                }
            }
            // If there are only ask orders in this price range
            else if (askBucket[j] > lowBound)
            {
                // If not last row -> just add colored
                if (i != 0)
                {
                    // Mark with slash (asks are on the right)
                    row += blue;
                    row += "/";
                    row += normal;
                }
                // Else, colored and underlined
                else
                {
                    // Mark with colored and underlined slash
                    row += undrLineBlue;
                    row += "/";
                    row += normal;
                }
            }
            // If there are no orders in this price range
            else
            {
                // If not last row
                if (i != 0)
                {
                    // Mark with whitespace
                    row += " ";
                }
                // Else, last row
                else
                {
                    // Mark with underline
                    row += "_";
                }
            }
        }

        // Add new row to the graph
        graph += (row + "\n");
    }

    // Set the mark to the minimal price range
    std::string xAxis1 = std::string(xAxisOffset, ' ') + '|';
    // Add the first marking to the graph
    graph += xAxis1;

    // Prepare variable for the quarter of the range
    unsigned int quart = (columns / 4);

    // Add 25% markings on the x axis
    for (unsigned int i = 0; i < 4; ++i)
        graph += std::string(quart - 1, ' ') + '|';

    // Move to the next line
    graph += '\n';

    // Stringify max value
    std::string xMaxStr = std::to_string(xMax);

    // Initial marking (we shift, based on the difference in size)
    graph += std::string(xAxis1.size() - xMaxStr.size() / 2, ' ') + std::to_string(xMin);

    // Iterate 4 times to add 25% markings
    for (unsigned int i = 1; i < 5; ++i)
    {
        // Add to the graph another markings
        graph += std::string(quart - xMaxStr.size(), ' ') +
                 std::to_string(xMin + i * quart * xStep);
    }

    // Add information about the graph data representation
    graph += "\n\nRange-amount cell with only ask orders is marked as blue '/' symbol. \n";
    graph += "Range-amount cell with only bid orders is marked as green '\\' symbol. \n";
    graph += "Range-amount cell with both ask and bid orders is marked as yellow 'X' symbol.";

    return graph;
};

/** Sort orders from all groups in container
 * @param ordTypePages container holding all applicable ordertype groups
 * @param minXValue minimal value for the x axis
 * @param XStepValue step value (price range) of single bucket
 * @param columns number of columns in the graph
 * @return vector of buckets containing amount of orders for different price range
 */
std::vector<double> Orderbook::allPagesToBuckets(const std::vector<OrdertypeGroup *> &ordTypePages,
                                                 const double minXValue,
                                                 const double XStepValue,
                                                 const unsigned int columns)
{
    // Result buckets vector
    std::vector<double> result(columns + 1, 0);

    // If group is not empty
    if (!ordTypePages.empty())
    {
        // Iterate over every group page
        for (OrdertypeGroup *grpAddr : ordTypePages)
        {
            // And add order from this group to the result
            grpAddr->OrdTypeGrpToBuckets(result, minXValue, XStepValue);
        }
    }

    return result;
};