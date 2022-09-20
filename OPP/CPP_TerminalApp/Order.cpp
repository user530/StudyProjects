#include "Order.h"
#include <iostream>

/** Constructor function for the single order
 * @param argPrice order price
 * @param argAmount order amount
 */
Order::Order(const double argPrice,
             const double argAmount) : price(argPrice),
                                       amount(argAmount){};
