#include "AdvisorBot.h"
#include <iostream>
#include "CSVReader.h"
#include "Errors.h"

/** Constructor function */
AdvisorBot::AdvisorBot(){};

/** Initialize application */
void AdvisorBot::init()
{
    // Greet user
    printGreeting();

    //  Setup current dateTime
    curDateTime = orderbook.getInitialDatetime();

    // Input variable
    std::string input;

    // Loop the application cycle
    while (true)
    {
        // Print menu
        printMenu();

        // Get user input
        input = getUserInput();

        // Make some space
        std::cout << '\n';

        // Process user input
        processUserInput(CSVReader::tokenise(input, ' '));
    }
};

/** Print initial greeting */
void AdvisorBot::printGreeting()
{
    std::cout << "\n*====================================================*\n"
              << "||   Welcome to the AdvisorBot trader assistance!   ||\n"
              << "||   Use this app to analyse cryptocurrency trade.  ||"
              << "\n*====================================================*\n";
};

/** Print application menu */
void AdvisorBot::printMenu()
{
    std::cout << "\n*=================================================================*\n"
              << "           AdvisorBot responds to the set of commands.\n"
              << "    You can type 'help' command to list all available commands.\n"
              << "*=================================================================*\n\n";
};

/** C1) List all available commands */
void AdvisorBot::printHelp()
{
    std::cout << "AdvisorBot uses following commands:\n"
              << "1) help\n"
              << "2) help <command_name>\n"
              << "3) prod\n"
              << "4) min <product> <price_type>\n"
              << "5) max <product> <price_type>\n"
              << "6) avg <product> <price_type> <timestamps_number>\n"
              << "7) predict <min/max> <product>\n"
              << "8) time\n"
              << "9) step\n"
              << "10) plot <date> <product> <timestamps_number>\n"
              << "11) struct\n"
              << "12) dates\n"
              << "To get additional information type 'help <command_name>'.\n";
};

/** C2) Output detailed help for the speciﬁed command
 * @param cmd name of the command
 */
void AdvisorBot::printCmdHelp(const std::string cmd)
{
    // If user request information about help command
    if (cmd == "help")
    {
        std::cout << "This command lists all valid commands or provides information about specific command.\n"
                  << "Command form - 'help' OR 'help <cmd>' - where:\n"
                  << "<cmd> - help, prod, min, etc.\n"
                  << "Information about all available commands can be found using 'help' command.\n";
    }
    // If user request information about prod command
    else if (cmd == "prod")
    {
        std::cout << "This command lists all products available on the market.\n"
                  << "Command form - 'prod'.\n";
    }
    // If user request information about min command
    else if (cmd == "min")
    {
        std::cout << "This command finds minimum bid or ask for the sent product in current timestamp.\n"
                  << "Command form - 'min <product> <price_type>' - where:\n"
                  << "<product> - ETH/BTC, DOGE/BTC, BTC/USDT, etc.\n"
                  << "Information about all available products can be found using 'prod' command.\n"
                  << "<price_type> - bid or ask.\n"
                  << "Bid is the maximum price that a buyer is willing to pay, while ask is the minimum price seller is willing to take for the product.\n";
    }
    // If user request information about max command
    else if (cmd == "max")
    {
        std::cout << "This command finds maximum bid or ask for the sent product in current timestamp.\n"
                  << "Command form - 'max <product> <price_type>' - where:\n"
                  << "<product> - ETH/BTC, DOGE/BTC, BTC/USDT, etc.\n"
                  << "Information about all available products can be found using 'prod' command.\n"
                  << "<price_type> - price type: bid or ask.\n"
                  << "Bid is the maximum price that a buyer is willing to pay, while ask is the minimum price seller is willing to take for the product.\n";
    }
    // If user request information about avg command
    else if (cmd == "avg")
    {
        std::cout << "This command computes average (weighted average) price for the sent product over the set number of timestamps.\n"
                  << "Command form - 'avg <product> <price_type> <timestamps_number>' - where:\n"
                  << "<product> - ETH/BTC, DOGE/BTC, BTC/USDT, etc.\n"
                  << "Information about all available products can be found using 'prod' command.\n"
                  << "<price_type> - price type: bid or ask.\n"
                  << "Bid is the maximum price that a buyer is willing to pay, while ask is the minimum price seller is willing to take for the product.\n"
                  << "<timestamps_number> - 1, 2, 3, etc.\n"
                  << "How many timestamps, starting from the current one, use for the calculation.\n";
    }
    // If user request information about predict command
    else if (cmd == "predict")
    {
        std::cout << "This command predicts requested price for the next timestamp (weighted moving average).\n"
                  << "Command form - 'predict <min/max> <product>' - where:\n"
                  << "<min/max> - min or max.\n"
                  << "Min is for the smallest price and Max is for the largest.\n"
                  << "<product> - ETH/BTC, DOGE/BTC, BTC/USDT, etc.\n"
                  << "Information about all available products can be found using 'prod' command.\n";
    }
    // If user request information about time command
    else if (cmd == "time")
    {
        std::cout << "This command prints current time in dataset.\n"
                  << "Command form - 'time'.\n";
    }
    // If user request information about step command
    else if (cmd == "step")
    {
        std::cout << "This command moves program to the next timestamp.\n"
                  << "Matching all orders from this and all previous timestamps for this date\n"
                  << "Command form - 'step'.\n";
    }
    // If user request information about plot command
    else if (cmd == "plot")
    {
        std::cout << "This command plots the market depth chart based on the orders "
                     "for the selected product over the set number of timestamps in selected date.\n"
                  << "Command form - 'plot <date> <product> <timestamps_number>' - where:\n"
                  << "<date> - 2020/06/01, 2020/06/02, etc.\n"
                  << "Information about all available dates can be found using 'dates' command.\n"
                  << "<product> - ETH/BTC, DOGE/BTC, BTC/USDT, etc.\n"
                  << "Information about all available products can be found using 'prod' command.\n"
                  << "<timestamps_number> - 1, 2, 3, etc.\n"
                  << "Collect data for visualisation from the selected number of timestamps from the selected date"
                     "(this argument differs from avg command,\n"
                  << "here we count timestamps for the date, not across the whole book)\n";
    }
    // If user request information about struct command
    else if (cmd == "struct")
    {
        std::cout << "This command list all orders in a structured way.\n"
                  << "Command form - 'struct'.\n";
    }
    // If user request information about dates command
    else if (cmd == "dates")
    {
        std::cout << "This command lists all dates from the orderbook.\n"
                  << "Command form - 'dates'.\n";
    }
    // If user passes undefined command argument
    else
    {
        std::cout << "Input error - Wrong argument!\n"
                  << "Please enter valid command name argument OR another command.\n";
    }
};

/** C3) List available products */
void AdvisorBot::printProducts()
{
    // Prepare result varibale
    std::string result = "This application contains orders for the following products: ";

    // Add products to the result string
    for (std::string product : orderbook.getAllProducts())
    {
        result += product + ", ";
    }

    // Print result, slicing last coma
    std::cout << result.substr(0, result.size() - 2) << "\n";
};

/** C4) Find and print minimum active bid or ask for product in current timestamp
 * @param prod requested product to predict order
 * @param ordType requested order type: bid(buy) or ask(sale)
 */
void AdvisorBot::findMin(const std::string prod, const std::string ordType)
{
    // If product argument is incorrect
    if (!orderbook.checkProdArg(prod))
    {
        // Print error and stop execution
        Errors::incrctProd();
        return;
    }

    // Transform argument data type
    OrderType OTP = OrdertypeGroup::strToOrdertype(ordType);

    // If ordertype argument is incorrect
    if (!orderbook.checkOTPArg(OTP))
    {
        // Print error and stop execution
        Errors::incrctOTP();
        return;
    }

    // Try to find requested product
    if (orderbook
            .getDayPage(curDateTime.first)
            .getTimestampPage(curDateTime.second)
            .checkProductPage(prod))
    {
        // Product exists, check for the ordertype
        if (orderbook
                .getDayPage(curDateTime.first)
                .getTimestampPage(curDateTime.second)
                .getProductPage(prod)
                .checkOrdertypePage(OTP))
        {
            // Get requested data
            double min = orderbook
                             .getCurMin(curDateTime.first, curDateTime.second, prod, OTP);

            // Print it to the user
            std::cout << "The min active " << ordType << " for " << prod
                      << " in current timestamp is " << min << ".\n";

            // Finish function execution
            return;
        }
    }

    // Function didn't ended -> so product wasn't found
    Errors::noProdCurPeriod();
};

/** C5) Find and print maximum active bid or ask for product in current timestamp
 * @param prod requested product to predict order
 * @param ordType requested order type: bid(buy) or ask(sale)
 */
void AdvisorBot::findMax(const std::string prod, const std::string ordType)
{
    // If product argument is incorrect
    if (!orderbook.checkProdArg(prod))
    {
        // Print error and stop execution
        Errors::incrctProd();
        return;
    }

    // Transform argument data type
    OrderType OTP = OrdertypeGroup::strToOrdertype(ordType);

    // If ordertype argument is incorrect
    if (!orderbook.checkOTPArg(OTP))
    {
        // Print error and stop execution
        Errors::incrctOTP();
        return;
    }

    // Try to find requested product
    if (orderbook
            .getDayPage(curDateTime.first)
            .getTimestampPage(curDateTime.second)
            .checkProductPage(prod))
    {
        // Product exists, check for the ordertype
        if (orderbook
                .getDayPage(curDateTime.first)
                .getTimestampPage(curDateTime.second)
                .getProductPage(prod)
                .checkOrdertypePage(OTP))
        {
            // Get requested data
            double max = orderbook
                             .getCurMax(curDateTime.first, curDateTime.second, prod, OTP);

            // Print it to the user
            std::cout << "The max " << ordType << " for " << prod
                      << " in current timestamp is " << max << ".\n";

            // Finish function execution
            return;
        }
    }

    // Function didn't ended -> so product wasn't found
    Errors::noProdCurPeriod();
};

/** C6) Compute and print average ask or bid for the sent product over the sent number
of timestamps
* @param prod requested product to predict order
* @param ordType requested order type: bid(buy) or ask(sale)
* @param stepsNum number of timestamps to collect order data (here numbering is continous across all periods, i.e. 1 - first timestamp for the first date)
*/
void AdvisorBot::findAvg(const std::string prod,
                         const std::string ordType,
                         const std::string stepsNum)
{
    // If product argument is incorrect
    if (!orderbook.checkProdArg(prod))
    {
        // Print error and stop execution
        Errors::incrctProd();
        return;
    }

    // Transform argument data type
    OrderType OTP = OrdertypeGroup::strToOrdertype(ordType);

    // If ordertype argument is incorrect
    if (!orderbook.checkOTPArg(OTP))
    {
        // Print error and stop execution
        Errors::incrctOTP();
        return;
    }

    // Try to convert string to int
    try
    {
        // Argument in form of int
        unsigned int stepsInt = std::stoul(stepsNum, nullptr);

        // Check that int is in range
        if (orderbook.checkTimestampArg(stepsInt))
        {
            // If range is valid -> calculate and print average for active orders
            std::cout << "The price of the average active " << ordType << " for " << prod
                      << " over the first " << stepsNum << " timestamps is "
                      << orderbook.getRangeAvg(prod, OTP, stepsInt) << ".\n";

            // Check if there were any sales for this product in requeste period
            double saleWA = orderbook.getRangeAvg(prod, OrderType::sale, stepsInt);

            // If product has sales data
            if (saleWA != 0)
                // Print average for successful sale orders
                std::cout << "The price of the average sale for " << prod
                          << " over the first " << stepsNum << " timestamps is "
                          << saleWA << ".\n";
        }
        // Number is out of range
        else
        {
            // Print error
            Errors::timeBookRange(orderbook.getTimestepsNum());
        }
    }

    // Conversion failed, wrong argument
    catch (const std::exception &e)
    {
        // Print error
        Errors::incrctTime();
    }
};

/** C7) Predict and print max or min, ask or bid for the requested product for the next timestamp
 * (Weighted moving average, based on https://www.investopedia.com/articles/technical/060401.asp)
 * @param extrema requested extrema: min or max
 * @param prod requested product to predict order
 * @param ordType requested order type: bid(buy) or ask(sale)
 */
void AdvisorBot::predictPrice(const std::string extrema,
                              const std::string prod,
                              const std::string ordType)
{
    // If extrema argument is incorrect
    if (!orderbook.checkExtremaArg(extrema))
    {
        // Print error and stop execution
        Errors::incrctExtrema();
        return;
    }

    // If product argument is incorrect
    if (!orderbook.checkProdArg(prod))
    {
        // Print error and stop execution
        Errors::incrctProd();
        return;
    }

    // Transform argument data type
    OrderType OTP = OrdertypeGroup::strToOrdertype(ordType);

    // If ordertype argument is incorrect
    if (!orderbook.checkOTPArg(OTP))
    {
        // Print error and stop execution
        Errors::incrctOTP();
        return;
    }

    // Calculate and print predicted price
    std::cout << "Predicted " << extrema << " price for " << prod << " " << ordType << " is "
              << orderbook.getPrediction(extrema, prod, OTP, curDateTime) << ".\n";
};

/** C8) State current time in dataset, i.e. which timeframe are we looking at */
void AdvisorBot::printTimestamp()
{
    std::cout << "Current date is: " << curDateTime.first
              << ", current timestamp is: " << curDateTime.second << ".\n";
};

/** C9) Move to next timestamp, match orders in the current date and print sales information */
void AdvisorBot::nextTurn()
{
    // Match orders from the current period with (from first period of the day until current one)
    orderbook.matchOrders(curDateTime.first, curDateTime.second);

    // Print information about sales from the current period
    orderbook.printSales(curDateTime.first, curDateTime.second);

    // Move to the next period
    curDateTime = orderbook.nextPeriod(curDateTime.first, curDateTime.second);
};

/** C10) Plot Market Depth Chart for the requested product across required number of timeperiods from the required date
 * @param date date to collect data
 * @param product product to collect related orders
 * @param steps number of timestamps in requested date, to collect product orders
 */
void AdvisorBot::plotGraph(const std::string date,
                           const std::string product,
                           const std::string steps)
{
    // If date argument is incorrect
    if (!orderbook.checkDateArg(date))
    {
        // Print error and stop execution
        Errors::incrctDate();
        return;
    }

    // If product argument is incorrect
    if (!orderbook.checkProdArg(product))
    {
        // Print error and stop execution
        Errors::incrctProd();
        return;
    }
    // Correct product, but no product data for requested date
    else if (!orderbook.getDayPage(date).getDayProducts().count(product))
    {
        // Print error and stop execution
        Errors::noProdReqPeriod();
        return;
    }

    // Prepare variable for data type transformation
    unsigned int stepsInt = 0;

    // Try to convert string to int and check steps argument
    try
    {
        // Argument in form of int
        stepsInt = std::stoul(steps, nullptr);
    }
    // Conversion failed, wrong argument
    catch (const std::exception &e)
    {
        // Print error and stop execution
        Errors::incrctTime();
        return;
    }

    // Check that int is in range
    if (orderbook.checkStampsInDate(date, stepsInt))
    {
        // Try to plot
        try
        {
            // If range is valid -> plot and print chart
            orderbook.marketDepthChart(date, product, stepsInt);
        }
        // Error in the process
        catch (const std::exception &e)
        {
            // Catch and print internal function error msg, then terminate
            std::cerr << e.what() << "\n";
            return;
        }
    }
    // Number is out of range
    else
    {
        // Print error and terminate
        Errors::timeDateRange(orderbook
                                  .getDayPage(date)
                                  .getTimestamps()
                                  .size());
        return;
    }
};

/** C11) List all orderbook in a structured way */
void AdvisorBot::printStruct()
{
    // Service message
    std::cout << "Current Orderbook has following structure:\n";

    // For the current orderbook -> print all data in a structured way
    orderbook.printOrderbook();
};

/** C12) List all available dates */
void AdvisorBot::printDates()
{
    // Prepare result varibale
    std::string result = "Current Orderbook contains following dates: ";

    // Add date to the result string
    for (auto &[dateStr, datePage] : orderbook.getAllDatetime())
    {
        result += dateStr + ", ";
    }

    // Print result, slicing last coma
    std::cout << result.substr(0, result.size() - 2) << "\n";
};

/** Prompt user for input, read his input into the string and return it
 * @return string containing user input
 */
std::string AdvisorBot::getUserInput()
{
    // Prepare string to read input
    std::string input;
    // Prompt user for the input
    std::cout << "Please enter your command: \n";
    // Read user input and save it to the prepared string variable
    std::getline(std::cin, input);
    // Return user input string
    return input;
};

/** Processes token string and responds with appropriate action
 * @param cmdVector-vector of strings defining user's command
 */
void AdvisorBot::processUserInput(const std::vector<std::string> cmdVector)
{
    // Check cmd string size and route to appropriate response
    switch (cmdVector.size())
    {
    // Empty input
    case 0:
    {
        // Respond with error msg
        Errors::emptyCmd();
        break;
    }

    // Command w/o additional argument
    case 1:
    {
        // Handle command string
        hadleSingleCmd(cmdVector[0]);

        break;
    }

    // Command with a single argument
    case 2:
    {
        // Handle command string with 1 argument
        hadle1ArgCmd(cmdVector[0], cmdVector[1]);

        break;
    }

    // Command with two arguments
    case 3:
    {
        // Handle command string with 2 arguments
        hadle2ArgCmd(cmdVector[0], cmdVector[1], cmdVector[2]);

        break;
    }

    // Command with three arguments
    case 4:
    {
        // Handle command string with 3 arguments
        hadle3ArgCmd(cmdVector[0], cmdVector[1], cmdVector[2], cmdVector[3]);

        break;
    }

    // There are no valid commands with 5+ token items -> Error
    default:
    {
        // Respond with error msg
        Errors::tooBigCmd();
        break;
    }
    }
}

/** Handle single line command -> route to appropriate function
 * @param cmd command line from the user input
 */
void AdvisorBot::hadleSingleCmd(std::string cmd)
{
    // General help command
    if (cmd == "help")
    {
        // Print help
        printHelp();
    }

    // Prod command
    else if (cmd == "prod")
    {
        // List all products
        printProducts();
    }

    // Time command
    else if (cmd == "time")
    {
        // Print current timestamp
        printTimestamp();
    }

    // Step command
    else if (cmd == "step")
    {
        // Move to the next timestamp
        nextTurn();
    }

    // Struct command
    else if (cmd == "struct")
    {
        // Print structured orderbook
        printStruct();
    }

    // Dates command
    else if (cmd == "dates")
    {
        // List all products
        printDates();
    }

    // Invalid 1 token string
    else
    {
        // Respond with error msg
        Errors::incrctCmd();
    }
};

/** Handle single arg commands  -> route to appropriate function
 * @param cmd command line from the user input
 * @param arg1 1st command line argument from the user input
 */
void AdvisorBot::hadle1ArgCmd(std::string cmd, std::string arg1)
{
    // Check command
    if (cmd == "help")
    {
        // Execute command with argument
        printCmdHelp(arg1);
    }
    // Invalid command string
    else
    {
        // Respond with error msg
        Errors::incrctCmd();
    }
};

/** Handle two arg commands -> route to appropriate function
 * @param cmd command line from the user input
 * @param arg1 1st command line argument from the user input
 * @param arg2 2nd command line argument from the user input
 */
void AdvisorBot::hadle2ArgCmd(std::string cmd, const std::string arg1, const std::string arg2)
{
    // Min command passed
    if (cmd == "min")
    {
        // Execute MIN command with arguments
        findMin(arg1, arg2);
    }
    // Max command passed
    else if (cmd == "max")
    {
        // Execute MAX command with arguments
        findMax(arg1, arg2);
    }
    // Invalid command string
    else
    {
        // Respond with error msg
        Errors::incrctCmd();
    }
};

/** Handle three arg commands -> route to appropriate function
 * @param cmd command line from the user input
 * @param arg1 1st command line argument from the user input
 * @param arg2 2nd command line argument from the user input
 * @param arg3 3rd command line argument from the user input
 */
void AdvisorBot::hadle3ArgCmd(std::string cmd, std::string arg1, std::string arg2, std::string arg3)
{
    // Avg command passed
    if (cmd == "avg")
    {
        // Execute AVG command with arguments
        findAvg(arg1, arg2, arg3);
    }
    // Predict command passed
    else if (cmd == "predict")
    {
        // Execute AVG command with arguments
        predictPrice(arg1, arg2, arg3);
    }
    // Plot command passed
    else if (cmd == "plot")
    {
        // Execute Plot command with arguments
        plotGraph(arg1, arg2, arg3);
    }
    else
    {
        // Respond with error msg
        Errors::incrctCmd();
    }
};