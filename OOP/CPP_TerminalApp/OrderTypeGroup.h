#pragma once
#include "Order.h"
#include <vector>
#include <list>

/** All supported OrderTypes: bid, ask, sale, unknown (Based on the merkelrex)*/
enum class OrderType
{
    bid,
    ask,
    sale,
    unknown
};

/** Overload stream extraction operator, to be able to print OrderType */
inline std::ostream &operator<<(std::ostream &out, const OrderType &ordertype)
{
    std::string result;
    if (ordertype == OrderType::bid)
    {
        result = "bid";
    }
    if (ordertype == OrderType::ask)
    {
        result = "ask";
    }
    if (ordertype == OrderType::sale)
    {
        result = "sale";
    }
    out << result;
    return out;
}

/** Class that holds information about the orders of specific ordertype */
class OrdertypeGroup
{
private:
    /** Minimum price for this order type */
    double _minPrice;

    /** Maximum price for this order type */
    double _maxPrice;

    /** Average price for this order type */
    double _avgPrice;

    /** Total volume of the orders */
    double _ttlVolume;

    /** Number of orders for this order type */
    unsigned int _orderCount;

    /** List of all orders */
    std::list<Order> _orderList;

public:
    /** Constructor */
    OrdertypeGroup();

    /** Function to add new order to the order type group and update group information */
    void addOrder(const Order &);

    /** Updates OrderTypeGroup information(min,max,avg,etc) based on the new order */
    void updateMetaAdd(const double, const double);

    /** Print information about all order from the list */
    void printGroup();

    /** Function to get minimum price of the OrderTypeGroup */
    double getMin();

    /** Function to get maximum price of the OrderTypeGroup */
    double getMax();

    /** Function to get average price of the OrderTypeGroup */
    double getAvg();

    /** Function to get total number of orders in OrderTypeGroup */
    unsigned int getOrdCnt();

    /** Function to get total volume of the OrderTypeGroup */
    double getTtlVol();

    /** Function to check if the ordertype group is empty */
    bool isEmpty();

    /** Function to convert string into OrderType datatype */
    static OrderType strToOrdertype(const std::string);

    /** Compare two orders by price - ascending order */
    static bool priceCompAsc(Order &, Order &);

    /** Compare two orders by price - descending order */
    static bool priceCompDes(Order &, Order &);

    /** Sort order list in ascending order (based on price) */
    void sortOrdPrAsc();

    /** Sort order list in descending order (based on price) */
    void sortOrdPrDes();

    /** Erase first order from the order list */
    void eraseFirstOrd();

    /** Erase last order from the order list */
    void eraseLastOrd();

    /** Update meta info when order is reduced */
    void updateMetaReduce(const double, const double);

    /** Update meta info when order is erased */
    void updateMetaErase(const double, const double, const OrderType &);

    /** Get the address of the object that holds order with maximum price */
    static OrdertypeGroup *getMaxPriceContainer(const std::vector<OrdertypeGroup *> &);

    /** Get the address of the object that holds order with minimum price */
    static OrdertypeGroup *getMinPriceContainer(const std::vector<OrdertypeGroup *> &);

    /** Match bids and ask vectors and get the sales object with resulting deals */
    static OrdertypeGroup matchVectors(const std::vector<OrdertypeGroup *> &,
                                       const std::vector<OrdertypeGroup *> &);

    /** Function to get min and max values from the range of the order type pages */
    static std::pair<double, double> getPriceSpread(const std::vector<OrdertypeGroup *> &);

    /** Function to get min and max values from the range of the order type pages */
    static std::pair<double, double> getAmountSpread(const std::vector<double> &);

    /** Put all orders amounts into buckets depending on the price */
    void OrdTypeGrpToBuckets(std::vector<double> &,
                             const double,
                             const double);
};