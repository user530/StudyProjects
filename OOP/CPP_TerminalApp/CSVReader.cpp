#include "CSVReader.h"
#include <fstream>
#include <iostream>
#include <regex>

/** Constructor function */
CSVReader::CSVReader(){};

/** Break string into vector of strings based on the separator
 * (from the merkelrex project)
 * @param line-line of text to be partitioned
 * @param separator-separator for the different tokens
 * @returns vector of the strings that formed the line
 */
std::vector<std::string> CSVReader::tokenise(const std::string line, const char separator)
{
    // Prepare result variable, token container
    std::vector<std::string> tokens;

    // Preapare index varibles for string partitioning
    signed int start, end;

    // Single token variable
    std::string token;

    // Set start index to first non-separator variable
    start = line.find_first_not_of(separator, 0);

    // Iterate over characters
    do
    {
        // End of the token
        end = line.find_first_of(separator, start);

        // If we reach the end -> break
        if (start == line.length() || start == end)
            break;
        // If there is non empty range -> token
        if (end >= 0)
            token = line.substr(start, end - start);
        // Last token
        else
            token = line.substr(start, line.length() - start);

        // Add token to the container
        tokens.push_back(token);

        // Move start index to the next character
        start = end + 1;
    } while (end > 0);

    return tokens;
};

/** Parse CSV file line by line and create orderbook from the file data
 * @param filename CSV file name
 * @return description of the return value
 */
std::map<std::string, DayData> CSVReader::transformCSV(const std::string filename)
{
    // Prepare result variable to store all data
    std::map<std::string, DayData> orderbook;

    // Open CSV file for reading
    std::ifstream csvFile{filename};

    // Variable to store single line of CSV data
    std::string line;

    // Check if file is opened successfully
    if (csvFile.is_open())
    {
        // Prepare line counter
        unsigned int curLine = 0;

        // Prepare successfull lines counter
        unsigned int ordAdd = 0;

        // Iterate file line by line
        while (std::getline(csvFile, line))
        {
            // Increment line counter
            ++curLine;

            // Tokenise the line
            std::vector<std::string> tokenLine = tokenise(line, ',');

            // If there is a problem with tokens -> skip line
            if (!checkCSVLine(tokenLine, curLine))
                continue;

            // Token data
            std::string date = splitDatetime(tokenLine[0]).first;
            std::string time = splitDatetime(tokenLine[0]).second;
            std::string prod = tokenLine[1];
            std::string ordType = tokenLine[2];
            std::string price = tokenLine[3];
            std::string amount = tokenLine[4];

            // Prepare Order to be inserted
            Order order = strToOrder(price, amount);
            OrderType OTP = OrdertypeGroup::strToOrdertype(ordType);

            // If there is no date page inside
            if (!orderbook.count(date))
            {
                // Create group wrapper and add order
                OrdertypeGroup ordGrp{};
                ordGrp.addOrder(order);
                // Create product wrapper and add ordertypegroup
                ProductPage prdGrp{};
                prdGrp.addOrdertypeGroup(OTP, ordGrp);
                // Create timestamp wrapper and add prodgrp
                TimestampPage timeGrp{};
                timeGrp.addProductPage(prod, prdGrp);
                // Create day wrapper and add timegrp
                DayData dayGrp{};
                dayGrp.addTimestampPage(time, timeGrp);
                // Add day wrapper to the orderbook
                orderbook.insert({date, dayGrp});
            }
            // Day page already exists
            else
            {
                // If there is no time page inside
                if (!orderbook[date].checkTimestampPage(time))
                {
                    // Create group wrapper and add order
                    OrdertypeGroup ordGrp{};
                    ordGrp.addOrder(order);
                    // Create product wrapper and add ordertypegroup
                    ProductPage prdGrp{};
                    prdGrp.addOrdertypeGroup(OTP, ordGrp);
                    // Create timestamp wrapper and add prodgrp
                    TimestampPage timeGrp{};
                    timeGrp.addProductPage(prod, prdGrp);
                    // Add timestamp page to the day page
                    orderbook[date]
                        .addTimestampPage(time, timeGrp);
                }
                // Day page already exists
                else
                {
                    // If there is no product page inside
                    if (!orderbook[date]
                             .getTimestampPage(time)
                             .checkProductPage(prod))
                    {
                        // Create group wrapper and add order
                        OrdertypeGroup ordGrp{};
                        ordGrp.addOrder(order);
                        // Create product wrapper and add ordertypegroup
                        ProductPage prdGrp{};
                        prdGrp.addOrdertypeGroup(OTP, ordGrp);
                        // Add product page to the timestamp page
                        orderbook[date]
                            .getTimestampPage(time)
                            .addProductPage(prod, prdGrp);
                    }
                    // Product page already exists
                    else
                    {
                        // If there is no ordertype page inside
                        if (!orderbook[date]
                                 .getTimestampPage(time)
                                 .getProductPage(prod)
                                 .checkOrdertypePage(OTP))
                        {
                            // Create group wrapper and add order
                            OrdertypeGroup ordGrp{};
                            ordGrp.addOrder(order);
                            // Add ordertype page to the product page
                            orderbook[date]
                                .getTimestampPage(time)
                                .getProductPage(prod)
                                .addOrdertypeGroup(OTP, ordGrp);
                        }
                        // If ordertype group already exists
                        else
                        {
                            // Ordertype page already exists
                            // Add order to the ordertype page
                            orderbook[date]
                                .getTimestampPage(time)
                                .getProductPage(prod)
                                .getOrdertypePage(OTP)
                                .addOrder(order);
                        }
                    }
                }
            }

            // Line added -> increment counter
            ++ordAdd;
        }
        // Report about result
        std::cout << curLine << " lines parsed, "
                  << ordAdd << " lines added to the orderbook.\n";
    }
    // If file wasn't opened
    else
    {
        std::cerr << "CSVReader::transformCSV - Can't find/open required file!\n";
    }

    // Return orderbook;
    return orderbook;
}

/** Create order from strings based on "Merkelrex strToOrderBookEntry"
 * @param priceStr string containing order price value
 * @param amountStr string containing order amount value
 * @return Order object
 */
Order CSVReader::strToOrder(const std::string priceStr, const std::string amountStr)
{
    // Prepare variables for transformation
    double price, amount;

    // Try to transform strings into doubles
    try
    {
        // Transform strings to doubles
        price = std::stod(priceStr);
        amount = std::stod(amountStr);
    }
    // If encountered problem in the process
    catch (const std::exception &e)
    {
        // Print error message and throw error
        std::cerr << "CSVReader::tokensToOrder - Invalid Order data!" << '\n';
        std::cerr << "Price value passed: '" << priceStr << "', "
                  << "amount value passed: '" << amountStr << "'.\n";
        throw;
    }

    // Return order
    return Order{price, amount};
};

/** Split date-time token into pair of values - date and time
 * @param datetimeStr string containing information about day and time
 * @return pair of strings where first one is date, and other one is timestamp
 * */
std::pair<std::string, std::string> CSVReader::splitDatetime(const std::string datetimeStr)
{
    // Prepare variables
    std::string date, time;
    // Try to split date-time token
    try
    {
        date = tokenise(datetimeStr, ' ')[0];
        time = tokenise(datetimeStr, ' ')[1];
    }
    // If encountered problem in the process
    catch (const std::exception &e)
    {
        // Print error message and throw error
        std::cerr << "CSVReader::splitDatetime - Invalid token!" << '\n';
        std::cerr << "Date-time passed: '" << datetimeStr << "'.\n";
        throw;
    }
    // If everything ok
    return std::make_pair(date, time);
};

/** Check the length of the token vector
 * @param vectorLength length of the token vector
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkTokensLength(const int vectorLength, const unsigned int line)
{
    // Check for the wrong token size
    if (vectorLength != 5)
    {
        // Message and return false
        std::cerr << "Line " << line << " size doesn't match! "
                  << "Order must contain 5 coma separated elements. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check that date time can be split
 * @param datetimeStr string containing information about day and time
 * @param line current CSV line
 * @return true if valid, false if not
 * */
bool CSVReader::checkDateTimeToken(const std::string datetimeStr, const unsigned int line)
{
    // Try to split datetime token into 2 parts: date and time
    try
    {
        std::string date = tokenise(datetimeStr, ' ')[0];
        std::string time = tokenise(datetimeStr, ' ')[1];
    }
    // If there is a problem
    catch (const std::exception &e)
    {
        // Message and return false
        std::cerr << "Line " << line << " problem with date-time token: " << datetimeStr
                  << "! Supported date-time format is 'DATE TIME'. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check date token correct format
 * @param dateStr date in the form of string
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkDateToken(const std::string dateStr, const unsigned int line)
{
    //  Regular expression for the date YYYY/MM/DD, copied from the:
    //  (https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd)
    std::regex dateReg("^\\d{4}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])$");

    //  Check that date matches indended format
    if (!std::regex_match(dateStr, dateReg))
    {
        // Message and return false
        std::cerr << "Line " << line << " wrong date token: " << dateStr
                  << "! Correct date format is YYYY/MM/DD. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check time token correct format
 * @param timeStr timestamp in the form of string
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkTimeToken(const std::string timeStr, const unsigned int line)
{
    //  Regular expression for the timestamp HH:mm::ss.SSSSSS
    std::regex timeReg("^([0-1]\\d|[2][0-3])\\:([0-5]\\d)\\:([0-5]\\d)\\.(\\d{6})$");

    //  Check that time matches intended format
    if (!std::regex_match(timeStr, timeReg))
    {
        // Message and return false
        std::cerr << "Line " << line << " wrong timestamp token: " << timeStr
                  << "! Correct time format is HH:mm::ss.SSSSSS. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check product token correct format
 * @param prodStr product in the form of string
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkProductToken(const std::string prodStr, const unsigned int line)
{
    //  Regular expression for the product in the form NAME1/NAME2 (Uppercase, latin, 2-6)
    std::regex prodReg("^([A-Z]{2,6})\\/([A-Z]{2,6})$");

    //  Check that product matches intended format
    if (!std::regex_match(prodStr, prodReg))
    {
        // Message and return false
        std::cerr << "Line " << line << " wrong product token: " << prodStr
                  << "! Correct product format is Name1/Name2 (Uppercase, latin, 2-6 characters). Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check ordertype token correct format
 * @param ordtpStr ordertype in the form of string
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkOrdertypeToken(const std::string ordtpStr, const unsigned line)
{
    //  Check that ordertype matches intended format
    if (ordtpStr != "bid" && ordtpStr != "ask")
    {
        // Message and return false
        std::cerr << "Line " << line << " wrong order type token: " << ordtpStr
                  << "! Supported order types are 'bid' and 'ask'. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check order value token correct format
 * @param ordStr order value (price/amount) in the form of string
 * @param line current CSV line
 * @return true if valid, false if not
 */
bool CSVReader::checkOrderToken(const std::string ordStr, const unsigned int line)
{
    // Try to transform string into double
    try
    {
        // Transform string to double
        double value = std::stod(ordStr);
    }
    // If encountered problem in the process
    catch (const std::exception &e)
    {
        // Message and return false
        std::cerr << "Line " << line << " wrong order value token: " << ordStr
                  << "! Order value must be a correct number. Skipping...\n";
        return false;
    }
    // If check is passed
    return true;
};

/** Check CSV line correctness
 * @param tokens CSV line in the form of vector of strings
 * @param line CSV line index
 * @return if all tokens have correct format -> true, else -> false
 */
bool CSVReader::checkCSVLine(const std::vector<std::string> tokens, const unsigned int line)
{
    // Check for the problem with the vector size
    if (!checkTokensLength(tokens.size(), line))
        return false;

    // Check for the problem with the datetime
    if (!checkDateTimeToken(tokens[0], line))
        return false;

    // Pair of date and time tokens
    std::pair<std::string, std::string> dateTime = splitDatetime(tokens[0]);

    // Check for the problem with the date
    if (!checkDateToken(dateTime.first, line))
        return false;

    // Check for the problem with the time
    if (!checkTimeToken(dateTime.second, line))
        return false;

    // Check for the problem with the product
    if (!checkProductToken(tokens[1], line))
        return false;

    // Check for the problem with the ordertype
    if (!checkOrdertypeToken(tokens[2], line))
        return false;

    // Check for the problem with the price
    if (!checkOrderToken(tokens[3], line))
        return false;

    // Check for the problem with the amount
    if (!checkOrderToken(tokens[4], line))
        return false;

    // If all checks are OK, return true
    return true;
};
