#pragma once
#include "ProductPage.h"
#include <set>

class TimestampPage
{
private:
    /** Container for different product pages from the same timestamp */
    std::map<std::string, ProductPage> _timedOrders;

    /** Set of all product keys */
    std::set<std::string> _products;

public:
    /** Constructor */
    TimestampPage();

    /** Function to add new product page to the timestamp page */
    void addProductPage(const std::string, const ProductPage &);

    /** Check if there is a page for this product */
    bool checkProductPage(const std::string);

    /** Get container stored at product name */
    ProductPage &getProductPage(const std::string);

    /** Print timestamp page and all its content */
    void printTimestampPage();

    /** Get list of all product keys stored inside this timepage */
    std::set<std::string> getProductKeys();
};
