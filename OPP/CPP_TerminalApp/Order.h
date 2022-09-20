#pragma once
#include <string>
#include <iostream>

class Order
{
public:
    /** Constructor */
    Order(const double, const double);

    /** Order price */
    double price;

    /** Order amount */
    double amount;
};