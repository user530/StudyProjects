#include "Errors.h"

/** Empty command error */
void Errors::emptyCmd()
{
    std::cerr << "Input error - Empty line!\n"
              << "Please enter valid command.\n";
};

/** Long command error */
void Errors::tooBigCmd()
{
    std::cerr << "Input error - Too many arguments passed!\n"
              << "Please enter valid command.\n";
};

/** Incorrect cmd error */
void Errors::incrctCmd()
{
    std::cerr << "Input error - Undefined command!\n"
              << "Please enter valid command.\n";
}

/** Incorrect product argument error */
void Errors::incrctProd()
{
    std::cerr << "Incorrect product argument passed!\n"
              << "Please check list of all valid products using 'prod' command.\n";
}

/** No product error in current period error */
void Errors::noProdCurPeriod()
{
    std::cerr << "There is no product data for the current date!\n"
              << "Please try another product.\n";
}

/** No product error in requested period error */
void Errors::noProdReqPeriod()
{
    std::cerr << "There is no product data for the requested date!\n"
              << "Please try another product or date.\n";
}

/** Incorrect order type argument error */
void Errors::incrctOTP()
{
    std::cerr << "Incorrect order type argument passed!\n"
              << "Valid values are 'bid' and 'ask'.\n";
}

/** Incorrect extrema argument error */
void Errors::incrctExtrema()
{
    std::cerr << "Incorrect extrema argument passed!\n"
              << "Valid values are 'min' and 'max'.\n";
}

/** Incorrect date argument error */
void Errors::incrctDate()
{
    std::cerr << "Incorrect date argument passed!\n"
              << "Please check list of all available dates using 'dates' command.\n";
}

/** Incorrect timestamps argument error */
void Errors::incrctTime()
{
    std::cerr << "Timestamps argument is incorrect!\n"
              << "Please pass valid number.\n";
}

/** Timestamps-date range error
 * @param ttlNum total number of timestamps in the requested date
 */
void Errors::timeDateRange(const std::size_t ttlNum)
{
    std::cerr << "Timestamps argument is out of range."
              << "There are total "
              << ttlNum
              << " timestamp(s) in requested date.\n";
}

/** Timestamps-orderbook range error
 * @param ttlNum total number of timestamps across all dates (in the whole orderbook)
 */
void Errors::timeBookRange(const std::size_t ttlNum)
{
    std::cerr << "Timestamps argument is out of range."
              << "There are total " << ttlNum
              << " timestamp(s) in the orderbook.\n";
}