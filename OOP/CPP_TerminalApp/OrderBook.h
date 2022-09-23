#pragma once
#include "DayData.h"

class Orderbook
{
private:
    /** Container for different market day pages */
    std::map<std::string, DayData> _orderbook;

public:
    /** Orderbook constructor*/
    Orderbook(const std::string);

    /** Returns specific day page */
    DayData &getDayPage(const std::string);

    /** Prints whole orderbook */
    void printOrderbook();

    /** Get all products */
    std::set<std::string> getAllProducts();

    /** Get minimum price for specified product */
    double getCurMin(const std::string, const std::string,
                     const std::string, const OrderType &);

    /** Get maximum price for specified product */
    double getCurMax(const std::string, const std::string,
                     const std::string, const OrderType &);

    /** Get average price for specified product across several timestamps */
    double getRangeAvg(const std::string, const OrderType &, const unsigned int);

    /** Predict requested order price for the next period */
    double getPrediction(const std::string, const std::string, const OrderType &,
                         const std::pair<std::string, std::string>);

    /** Get all date-time information */
    std::map<std::string,
             std::vector<std::string>>
    getAllDatetime();

    /** Get number of time periods */
    unsigned int getTimestepsNum();

    /** Check that product argument exists in the book */
    bool checkProdArg(const std::string);

    /** Check that ordertype argument is correct */
    bool checkOTPArg(const OrderType &);

    /** Check that timestamp argument is correct */
    bool checkTimestampArg(const unsigned int);

    /** Check that date argument is correct */
    bool checkDateArg(const std::string);

    /** Check that number of periods  */
    bool checkStampsInDate(const std::string, const unsigned int);

    /** Check that order extrema argument is correct */
    bool checkExtremaArg(const std::string);

    /** Get initial datetime */
    std::pair<std::string, std::string> getInitialDatetime();

    /** Move to the next time stamp (OR day) */
    std::pair<std::string, std::string> nextPeriod(const std::string, const std::string);

    /** Collect addresses of order type groups that meet the criteria */
    std::vector<OrdertypeGroup *> collectOrdTypPages(const std::string,
                                                     const std::string,
                                                     const std::string,
                                                     const OrderType &);

    /** Match orders in specified date-time */
    void matchOrders(const std::string, const std::string);

    /** Print all sales in the requested period */
    void printSales(const std::string, const std::string);

    /** Visualise the market data in the form of the depth data graph */
    void marketDepthChart(const std::string,
                          const std::string,
                          const unsigned int);

    /** Calculate information about the X axis for the chart */
    std::map<std::string, double> getXinfo(std::vector<OrdertypeGroup *> &,
                                           std::vector<OrdertypeGroup *> &,
                                           const unsigned int);

    /** Calculate information about the Y axis for the chart */
    std::map<std::string, double> getYinfo(std::vector<double> &,
                                           std::vector<double> &,
                                           const unsigned int);

    /** Prepare yAxisData do add to the plot */
    std::string yAxisRowData(const double, const double, const double, const int);

    /** Plot the data */
    std::string plodData(const std::vector<double> &,
                         const std::vector<double> &,
                         const unsigned int,
                         const unsigned int,
                         const double,
                         const double,
                         const double,
                         const double,
                         const double,
                         const double);

    /** Prepare buckets vector from all ordertype group pages of ceratin OrderType */
    std::vector<double>
    allPagesToBuckets(const std::vector<OrdertypeGroup *> &,
                      const double,
                      const double,
                      const unsigned int);
};
