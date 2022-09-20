#pragma once
#include "OrderBook.h"

class CSVReader
{
public:
    /** Constructor */
    CSVReader();

    /** Break string into vector of strings based on the separator */
    static std::vector<std::string> tokenise(const std::string, const char);

    /** Transform CSV file into OrderBook map */
    static std::map<std::string, DayData> transformCSV(const std::string);

private:
    /** Create order from strings based on "Merkelrex strToOrderBookEntry" */
    static Order strToOrder(const std::string, const std::string);

    /** Date-time token split */
    static std::pair<std::string, std::string> splitDatetime(const std::string);

    /** Check the length of the token vector */
    static bool checkTokensLength(const int, const unsigned int);

    /** Check that date-time token can be split */
    static bool checkDateTimeToken(const std::string, const unsigned int);

    /** Check date token correct format */
    static bool checkDateToken(const std::string, const unsigned int);

    /** Check time token correct format */
    static bool checkTimeToken(const std::string, const unsigned int);

    /** Check product token correct format */
    static bool checkProductToken(const std::string, const unsigned int);

    /** Check ordertype token correct format */
    static bool checkOrdertypeToken(const std::string, const unsigned int);

    /** Check order value token correct format */
    static bool checkOrderToken(const std::string, const unsigned int);

    /** Check CSV line correctness */
    static bool checkCSVLine(const std::vector<std::string>, const unsigned int);
};