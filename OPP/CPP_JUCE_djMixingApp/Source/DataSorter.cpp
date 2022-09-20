/*
  ==============================================================================

    DataSorter.cpp
    Created: 10 Mar 2022 8:35:22pm
    Author:  eosdu

  ==============================================================================
*/

#include "DataSorter.h"

//==============================================================================

DataSorter::DataSorter(const juce::String& attributeToSortBy, bool forwards)
    : attributeToSort(attributeToSortBy),
            direction(forwards ? 1 : -1)
{};

const int DataSorter::compareElements(juce::XmlElement* first, juce::XmlElement* second) const
{
    // Index, to declare order
    auto result = first->getStringAttribute(attributeToSort)
        .compareNatural(second->getStringAttribute(attributeToSort));

    // If elements have same value of the attribute, sort them by the ID value
    if (result == 0)
        result = first->getStringAttribute("ID")
        .compareNatural(second->getStringAttribute("ID"));

    // Order, modified by the direction
    return direction * result;
};
