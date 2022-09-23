#include "TimestampPage.h"

/** Timestamp page constructor, holds several product pages */
TimestampPage::TimestampPage(){};

/** Function to add new product page to the timestamp page
 * @param prodName product name to store associated data
 * @param prodPage group object that holds related orders
 * */
void TimestampPage::addProductPage(const std::string prodName, const ProductPage &prodPage)
{
    //  Insert selected productPage associated with the given name
    _timedOrders.insert({prodName, prodPage});

    // Add key to the product key (if needed)
    _products.insert(prodName);
};

/** Check if there is a page for this product
 * @param prodStr product (key) name
 * @return true if value exists, false otherwise
 */
bool TimestampPage::checkProductPage(const std::string prodStr)
{
    return _timedOrders.count(prodStr);
};

/** Get container stored at product name
 * @param prodStr product (key) name
 * @return reference to the product object
 */
ProductPage &TimestampPage::getProductPage(const std::string prodStr)
{
    // Try to get requested timestamp page
    try
    {
        return _timedOrders.at(prodStr);
    }
    // If there is no page available
    catch (const std::exception &e)
    {
        // Report error
        std::cerr << "TimestampPage::getProductPage - Error! Can't find requested page! ("
                  << e.what() << ").\n";
        throw;
    }
}

/** Print timestamp page and all its content */
void TimestampPage::printTimestampPage()
{
    // Iterate over all products
    for (auto &[prodName, prodPage] : _timedOrders)
    {
        // Print product page information
        std::cout << "||    |    Product page: " << prodName << " {\n";
        prodPage.printProductPage();
        std::cout << "||    |     }\n";
    }
};

/** Get list of all product keys stored inside this timepage
 * @return set of all product names (strings)
 *  */
std::set<std::string> TimestampPage::getProductKeys()
{
    return _products;
};