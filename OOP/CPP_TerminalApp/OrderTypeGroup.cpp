#include "OrdertypeGroup.h"
#include <algorithm>

/** Ordertype group constructor, holds list of all orders and group information */
OrdertypeGroup::OrdertypeGroup() : _minPrice(999999999),
                                   _maxPrice(0),
                                   _avgPrice(0),
                                   _ttlVolume(0),
                                   _orderCount(0),
                                   _orderList(){};

/** Function to add new order to the order type group and update group information
 * @param order order object that will be added
 * */
void OrdertypeGroup::addOrder(const Order &order)
{
    // Add order object to the vector
    _orderList.push_back(order);
    // Update OrderTypeGroup information based on the new order
    updateMetaAdd(order.price, order.amount);
};

/** Updates OrderTypeGroup information(min,max,avg,etc) based on the new order
 *  @param orderPrice price of the new order
 *  @param orderAmount amount of the new order
 * */
void OrdertypeGroup::updateMetaAdd(const double orderPrice, const double orderAmount)
{
    // Check for the new min
    if (orderPrice < _minPrice)
    {
        // If so, update min price
        _minPrice = orderPrice;
    }

    // Check for the new max
    if (orderPrice > _maxPrice)
    {
        // If so, update max price
        _maxPrice = orderPrice;
    }

    // Update avg price
    _avgPrice = (_avgPrice * _ttlVolume + orderPrice * orderAmount) /
                (_ttlVolume + orderAmount);

    // Update total
    _ttlVolume += orderAmount;

    // Update order count
    ++_orderCount;
}

/** Print information about all order from the list */
void OrdertypeGroup::printGroup()
{
    // Iterate over all orders
    for (const Order &ord : _orderList)
    {
        // Print order information
        std::cout << "||    |    *    +    Order price: " << ord.price << "; "
                  << "Order amount: " << ord.amount << "\n";
    }
};

/** Function to get minimum price of the OrderTypeGroup */
double OrdertypeGroup::getMin()
{
    return _minPrice;
};

/** Function to get maximum price of the OrderTypeGroup */
double OrdertypeGroup::getMax()
{
    return _maxPrice;
};

/** Function to get average price of the OrderTypeGroup */
double OrdertypeGroup::getAvg()
{
    return _avgPrice;
};

/** Function to get total number of orders in OrderTypeGroup */
unsigned int OrdertypeGroup::getOrdCnt()
{
    return _orderCount;
};

/** Function to get total volume of the OrderTypeGroup */
double OrdertypeGroup::getTtlVol()
{
    return _ttlVolume;
};

/** Function to check if the ordertype group is empty
 * @return true if orderlist is empty, false otherwise
 */
bool OrdertypeGroup::isEmpty()
{
    return _orderList.empty();
};

/** Function to convert string into OrderType datatype
 * @param ordtpStr order type string
 * @return order type object
 */
OrderType OrdertypeGroup::strToOrdertype(const std::string ordtpStr)
{
    if (ordtpStr == "bid")
    {
        return OrderType::bid;
    }
    if (ordtpStr == "ask")
    {
        return OrderType::ask;
    }
    return OrderType::unknown;
};

/** Compare two orders by price - ascending order
 * @param ord1 first order object
 * @param ord2 second order object
 * @param true true if price of the first order is lower, false otherwise
 */
bool OrdertypeGroup::priceCompAsc(Order &ord1, Order &ord2)
{
    return ord1.price < ord2.price;
};

/** Compare two orders by price - descending order
 * @param ord1 first order object
 * @param ord2 first order object
 * @param true true if price of the first order is higher, false otherwise
 */
bool OrdertypeGroup::priceCompDes(Order &ord1, Order &ord2)
{
    return ord1.price > ord2.price;
};

/** Sort order list in ascending order (based on price) */
void OrdertypeGroup::sortOrdPrAsc()
{
    _orderList.sort(priceCompAsc);
};

/** Sort order list in descending order (based on price) */
void OrdertypeGroup::sortOrdPrDes()
{
    _orderList.sort(priceCompDes);
};

/** Erase first order from the order list */
void OrdertypeGroup::eraseFirstOrd()
{
    // Update OrdGrp data: max, min, avg, etc!
    _orderList.pop_front();
};

/** Erase last order from the order list */
void OrdertypeGroup::eraseLastOrd()
{
    // Update OrdGrp data: max, min, avg, etc!
    _orderList.pop_back();
};

/** Update meta info when order is reduced
 * @param grpPage container that holds order
 * @param price price of the order
 * @param amount amount of the order
 */
void OrdertypeGroup::updateMetaReduce(const double price,
                                      const double amount)
{
    // Update average price
    _avgPrice = ((_avgPrice * _ttlVolume) - (price * amount)) /
                (_ttlVolume - amount);
    // Update total volume
    _ttlVolume -= amount;
};

/** Update meta info when order is erased
 * @param grpPage container that holds order
 * @param price price of the order
 * @param amount amount of the order
 * @param ordType order type of the group that holds order
 */
void OrdertypeGroup::updateMetaErase(const double price,
                                     const double amount,
                                     const OrderType &ordType)
{
    // If element completly erased we need to set new min or max
    // Because when we match them, they are already sorted we can set new min or max
    // Bids are sorted in descending order, and asks in ascending

    // If this is the last element -> set all to zero
    if (_orderList.size() == 1)
    {
        _maxPrice = 0;
        _minPrice = 0;
        _avgPrice = 0;
        _ttlVolume = 0;
    }
    // There are element left in the orderlist
    else
    {
        // Index of the first element
        auto ind = _orderList.begin();

        // Check the type of the group
        if (ordType == OrderType::bid)
        {
            // Next max price -> price of the next element
            _maxPrice = std::next(ind)->price;
        }
        else if (ordType == OrderType::ask)
        {
            // Next min price -> price of the next element
            _minPrice = std::next(ind)->price;
        }
        else
        {
            std::cerr << "OrdertypeGroup::updateMetaErase - Error! Wrong ordType argument!\n";
            throw;
        }

        // Update avg price and total amount
        updateMetaReduce(price, amount);
    }
    // Update order count
    --_orderCount;
};

/** Get the address of the object that holds order with maximum price
 * @param ordTypePages vector of addresses to ordertype groups
 * @return address to the ordertype group with highest price order
 */
OrdertypeGroup *OrdertypeGroup::getMaxPriceContainer(const std::vector<OrdertypeGroup *> &ordTypePages)
{
    // Check argument before start -> print error msg and return nullptr if empty
    if (ordTypePages.empty())
    {
        std::cerr << "OrdertypeGroup::getMaxPriceContainer - argument error! Empty vector passed. \n";
        return nullptr;
    }

    // Declare first page as maximum page, set address to the maxPage
    OrdertypeGroup *maxPage = ordTypePages[0];

    // Iterate over all pages, starting from the second
    for (int i = 1; i < ordTypePages.size(); ++i)
    {
        // If selected page has price value bigger than current maximum page
        if (ordTypePages[i]->_maxPrice > maxPage->_maxPrice)
        {
            // Max page address set to the selected page
            maxPage = ordTypePages[i];
        }
    }

    // If after all iterations all ord type pages are empty -> signal with null
    if (maxPage->_ttlVolume == 0)
        maxPage = nullptr;

    // Return the address to the Ordertype group that holds maximum value
    return maxPage;
};

/** Get the address of the object that holds order with minimum price
 * @param ordTypePages vector of addresses to ordertype groups
 * @return address to the ordertype group with lowest price order
 */
OrdertypeGroup *OrdertypeGroup::getMinPriceContainer(const std::vector<OrdertypeGroup *> &ordTypePages)
{
    // Check argument before start -> print error msg and return nullptr if empty
    if (ordTypePages.empty())
    {
        std::cerr << "OrdertypeGroup::getMinPriceContainer - argument error! Empty vector passed. \n";
        return nullptr;
    }

    // Declare first page as minimum page page, set address to the minPage
    OrdertypeGroup *minPage = ordTypePages[0];

    // Iterate over all pages, starting from the second
    for (int i = 1; i < ordTypePages.size(); ++i)
    {
        // If selected page has price value smaller than current minimum page
        if (ordTypePages[i]->_minPrice < minPage->_minPrice)
        {
            // Min page address set to the selected page
            minPage = ordTypePages[i];
        }
    }

    // If after all iterations all ord type pages are empty -> signal with null
    if (minPage->_ttlVolume == 0)
        minPage = nullptr;

    // Return the address to the Ordertype group that holds minimum value
    return minPage;
};

/** Match bids and ask vectors and get the sales object with resulting deals
 *  @param asks vector of pointers to all suitable ask pages
 *  @param bids vector of pointers to all suitable bid pages
 *  @return 'sales' group page, containing all deals from this period
 */
OrdertypeGroup OrdertypeGroup::matchVectors(const std::vector<OrdertypeGroup *> &asks,
                                            const std::vector<OrdertypeGroup *> &bids)
{
    // Prepare result variable
    OrdertypeGroup sales{};

    // Get minimum ask, else null pointer
    OrdertypeGroup *minAskAddr = getMinPriceContainer(asks);

    // Get maximum bid, else null pointer
    OrdertypeGroup *maxBidAddr = getMaxPriceContainer(bids);

    // Iterate over minAsks
    while (minAskAddr != nullptr)
    {
        // Iterate over maxBids
        while (maxBidAddr != nullptr)
        {
            // Minimum ask price and amount
            double minAskPr = minAskAddr->_orderList.begin()->price;
            double minAskAm = minAskAddr->_orderList.begin()->amount;

            // Maximum bid price and amount
            double maxBidPr = maxBidAddr->_orderList.begin()->price;
            double maxBidAm = maxBidAddr->_orderList.begin()->amount;

            // Check for the match
            if (minAskPr <= maxBidPr)
            {
                // If bid didn't cover ask
                if (minAskAm > maxBidAm)
                {
                    // Prepare partial sale
                    Order sale{minAskPr, maxBidAm};

                    // Add it to the result
                    sales.addOrder(sale);

                    // Update ask group info
                    minAskAddr->updateMetaReduce(minAskPr, maxBidAm);

                    // Modify ask order
                    minAskAddr->_orderList.begin()->amount -= maxBidAm;

                    // Update bid group info
                    maxBidAddr->updateMetaErase(maxBidPr, maxBidAm, OrderType::bid);

                    // Erase bid order
                    maxBidAddr->eraseFirstOrd();

                    // Because we erased bid -> repoint maxBidAddr
                    maxBidAddr = getMaxPriceContainer(bids);
                }
                // If orders are equal in terms of amount
                else if (minAskAm == maxBidAm)
                {
                    // Prepare sale
                    Order sale{minAskPr, minAskAm};

                    // Add it to the result
                    sales.addOrder(sale);

                    // Update ask group info
                    minAskAddr->updateMetaErase(minAskPr, minAskAm, OrderType::ask);

                    // Erase ask order
                    minAskAddr->eraseFirstOrd();

                    // Update bid group info
                    maxBidAddr->updateMetaErase(maxBidPr, maxBidAm, OrderType::bid);

                    // Erase bid order
                    maxBidAddr->eraseFirstOrd();

                    // Because we erased both -> repoint maxBidAddr and minAskAddr
                    minAskAddr = getMinPriceContainer(asks);
                    maxBidAddr = getMaxPriceContainer(bids);
                }
                // If bid clears out the ask
                else if (minAskAm < maxBidAm)
                {
                    // Prepare partial sale
                    Order sale{minAskPr, minAskAm};

                    // Add it to the result
                    sales.addOrder(sale);

                    // Update ask group info
                    minAskAddr->updateMetaErase(minAskPr, minAskAm, OrderType::ask);

                    // Erase ask order
                    minAskAddr->eraseFirstOrd();

                    // Update bid group info
                    maxBidAddr->updateMetaReduce(maxBidPr, minAskAm);

                    // Modify bid order
                    maxBidAddr->_orderList.begin()->amount -= minAskAm;

                    // Because we erased ask -> repoint minAskAddr
                    minAskAddr = getMinPriceContainer(asks);

                    // And break out of inner (bid) loop
                    break;
                }
            }
            // If highest bid didn't match lowest ask -> no more matches, end execution
            else
                return sales;
        }

        // If asks cleared all the bids -> stop iterating
        if (maxBidAddr == nullptr)
            break;
    }

    // Return all sales for this product
    return sales;
}

/** Function to get min and max values from the range of the order type pages
 * @param ordTypePages vector of addresses to ordertype groups
 * @return pair of values: max and min prices for the requested ordertype group
 */
std::pair<double, double> OrdertypeGroup::getPriceSpread(const std::vector<OrdertypeGroup *> &ordTypePages)
{
    // Initialize price range variables
    double min = 0, max = 0;

    // If order type vector is not empty
    if (!ordTypePages.empty())
    {
        // Set max and min values
        max = OrdertypeGroup::getMaxPriceContainer(ordTypePages)->getMax();
        min = OrdertypeGroup::getMinPriceContainer(ordTypePages)->getMin();
    }

    return std::make_pair(max, min);
};

/** Function to get min and max values from the range of the order type pages
 * @param OTPBucket vector of amounts of orders for different price ranges
 * @return pair of values: max and min amount for the requested ordertype group
 */
std::pair<double, double> OrdertypeGroup::getAmountSpread(const std::vector<double> &OTPBucket)
{
    // Initialize amount range variables
    double min = 0, max = 0;

    // If bucket vector is not empty
    if (!OTPBucket.empty())
    {
        // Set amount range variables to the initial value
        min = OTPBucket[0];
        max = OTPBucket[0];

        // Iterate over all buckets
        for (const double amount : OTPBucket)
        {
            // If bucket amount is lesser than min
            if (amount < min)
                // Set new min value
                min = amount;
            // If bucket amount is bigger than max
            else if (amount > max)
                // Set new max value
                max = amount;
        }
    }
    // If empty vector passed -> throw error
    else
    {
        throw std::invalid_argument("OrdertypeGroup::getAmountSpread - Empty vector passed!");
    }

    return std::make_pair(max, min);
};

/** Put all orders amounts into buckets depending on the price
 * @param buckets buckets vector that stores all amounts
 * @param minVal minimal value of the x-axis
 * @param step step value of the x-axis
 */
void OrdertypeGroup::OrdTypeGrpToBuckets(std::vector<double> &buckets,
                                         const double minVal,
                                         const double step)
{
    // Iterate over every order in the order list
    for (const Order &order : _orderList)
    {
        // Calculate the index to store the price amount (int will erase fraction)
        unsigned int ind = (order.price - minVal) / step;
        // If buckets size is out of range
        if (ind >= buckets.size())
        {
            std::cerr << "OrdertypeGroup::OrdTypeGrpToBuckets - Index is out of bounds!\n";
            ind = buckets.size() - 1;
        }
        // Add order amount to the target bucket
        buckets[ind] += order.amount;
    }
};