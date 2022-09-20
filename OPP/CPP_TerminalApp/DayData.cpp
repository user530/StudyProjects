#include "DayData.h"

/** Constructor function */
DayData::DayData(){};

/** Function to add new product page to the timestamp page
 * @param timestamp timestamp name to store associated data
 * @param timeOrders group object that holds orders from the same timestamp
 * */
void DayData::addTimestampPage(const std::string timestamp, const TimestampPage &timeOrders)
{
    //  Insert selected timestampPage associated with the given timestamp
    _dailyOrders.insert({timestamp, timeOrders});
};

/** Check if there is a group page for this timestamp
 * @param timeStr timestamp (key) name
 * @return true if key exists, false otherwise
 */
bool DayData::checkTimestampPage(const std::string timeStr)
{
    return _dailyOrders.count(timeStr);
};

/** Get container stored at timestamp name
 * @param timeStr timestamp (key) name
 * @return reference to the timestamp object
 */
TimestampPage &DayData::getTimestampPage(const std::string timeStr)
{
    // Try to get requested timestamp page
    try
    {
        return _dailyOrders.at(timeStr);
    }
    // If there is no page available
    catch (const std::exception &e)
    {
        // Report error
        std::cerr << "DayData::getTimestampPage - Error! Can't find requested page! ("
                  << e.what() << ").\n";
        throw;
    }
}

/** Get all timestamp pages for this date */
std::map<std::string, TimestampPage> &DayData::getDailyOrders()
{
    return _dailyOrders;
};

/** Print timestamp page and all its content */
void DayData::printDayPage()
{
    // Iterate over all timestamps
    for (auto &[timestamp, timeOrders] : _dailyOrders)
    {
        // Print timestamp page information
        std::cout << "||    Timestamp: " << timestamp << " {\n";
        timeOrders.printTimestampPage();
        std::cout << "||     }\n";
    }
};

/** Get all products from this day page
 * @return set of all product names (strings)
 */
std::set<std::string> DayData::getDayProducts()
{
    // All products from inside this day page
    std::set<std::string> products;

    // Iterate over all timepages
    for (auto &[timeStr, timeGrp] : _dailyOrders)
    {
        // For each timepage, get all products and add them to the resulting set
        products.merge(timeGrp.getProductKeys());
    }

    // Return the products list
    return products;
};

/** Get all timestamps from this day page
 * @return set of all timestamp names (strings)
 */
std::vector<std::string> DayData::getTimestamps()
{
    // All timestamps from inside this day page
    std::vector<std::string> timestamps;

    // Iterate over all day entries
    for (auto iterator = _dailyOrders.begin(); iterator != _dailyOrders.end(); ++iterator)
    {
        // Add every timestamp to the collecion
        timestamps.push_back(iterator->first);
    }

    // Return timestamp list
    return timestamps;
};