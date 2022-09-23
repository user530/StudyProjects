#pragma once
#include "TimestampPage.h"

class DayData
{
private:
    /** Container for different timestamps from the same day */
    std::map<std::string, TimestampPage> _dailyOrders;

public:
    /** Constructor */
    DayData();

    /** Function to add new product page to the timestamp page */
    void addTimestampPage(const std::string, const TimestampPage &);

    /** Check if there is a group page for this timestamp */
    bool checkTimestampPage(const std::string);

    /** Get container stored at timestamp name */
    TimestampPage &getTimestampPage(const std::string);

    /** Get all timestamp pages for this date */
    std::map<std::string, TimestampPage> &getDailyOrders();

    /** Print timestamp page and all its content */
    void printDayPage();

    /** Get all products from this day page */
    std::set<std::string> getDayProducts();

    /** Get all timestamps from this day page */
    std::vector<std::string> getTimestamps();
};
