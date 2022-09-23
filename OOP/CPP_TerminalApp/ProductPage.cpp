#include "ProductPage.h"

/** Product page constructor, holds several ordertype groups */
ProductPage::ProductPage(){};

/** Function to add new ordertype group to the product page
 * @param groupType ordertype of the ordergroup (bid,ask,sale)
 * @param ordertypeGroup group object that holds related orders
 * */
void ProductPage::addOrdertypeGroup(const OrderType &groupType, const OrdertypeGroup &ordertypeGroup)
{
    //  Insert selected ordertypeGroup associated with the required groupType
    _productOrders.insert({groupType, ordertypeGroup});
};

/** Check if there is a page for this ordertype
 * @param ordType referencr to the ordertype (key) object
 * @return true if value exists, false otherwise
 */
bool ProductPage::checkOrdertypePage(const OrderType &ordType)
{
    return _productOrders.count(ordType);
};

/** Get container stored at requested ordertype
 * @param ordType referencr to the ordertype (key) object
 * @return reference to the Ordertype object
 */
OrdertypeGroup &ProductPage::getOrdertypePage(const OrderType &ordType)
{
    // Try to get requested timestamp page
    try
    {
        return _productOrders.at(ordType);
    }
    // If there is no page available
    catch (const std::exception &e)
    {
        // Report error
        std::cerr << "ProductPage::getOrdertypePage - Error! Can't find requested page! ("
                  << e.what() << ").\n";
        throw;
    }
};

/** Print product page and all its content */
void ProductPage::printProductPage()
{
    // Iterate over all groups in product page
    for (auto &[groupName, ordergroup] : _productOrders)
    {
        // Print ordergroup information
        std::cout << "||    |    *    Order group: " << groupName << " {\n";
        ordergroup.printGroup();
        std::cout << "||    |    *     }\n";
    }
};
