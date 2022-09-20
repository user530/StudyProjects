#pragma once
#include "OrdertypeGroup.h"
#include <map>

class ProductPage
{
private:
    /** Container for all types of orders for one product */
    std::map<OrderType, OrdertypeGroup> _productOrders;

public:
    /** Constructor */
    ProductPage();

    /** Function to add new ordertype group to the product page */
    void addOrdertypeGroup(const OrderType &, const OrdertypeGroup &);

    /** Check if there is a page for this ordertype */
    bool checkOrdertypePage(const OrderType &);

    /** Get container stored at requested ordertype */
    OrdertypeGroup &getOrdertypePage(const OrderType &);

    /** Print product page and all its content */
    void printProductPage();
};