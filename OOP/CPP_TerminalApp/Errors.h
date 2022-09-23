#pragma once
#include <iostream>

class Errors
{
public:
    /** Constructor */
    Errors();

    /** Empty command error */
    static void emptyCmd();

    /** Long command error */
    static void tooBigCmd();

    /** Incorrect command error */
    static void incrctCmd();

    /** Incorrect product argument error */
    static void incrctProd();

    /** No product error in current period error */
    static void noProdCurPeriod();

    /** No product error in requested period error */
    static void noProdReqPeriod();

    /** Incorrect order type argument error */
    static void incrctOTP();

    /** Incorrect extrema argument error */
    static void incrctExtrema();

    /** Incorrect date argument error */
    static void incrctDate();

    /** Incorrect timestamps argument error */
    static void incrctTime();

    /** Timestamps-date range error */
    static void timeDateRange(const std::size_t);

    /** Timestamps-orderbook range error */
    static void timeBookRange(const std::size_t);
};