/*
  ==============================================================================

    DataSorter.h
    Created: 10 Mar 2022 8:35:22pm
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include "JuceHeader.h"

// Comparator class used to sort data in table 
// (from the WidgetsDemo from the base JUCE demo collection, adapted)
class DataSorter
{
public:
    /// <summary> Constructor </summary>
    /// <param name="attributeToSortBy"> - Attribute that will be used as the base for sorting </param>
    /// <param name="forwards"> - Direction to choose order (ascending/descending) </param>
    DataSorter(const juce::String& attributeToSortBy, bool forwards);


    /// <summary> Comparator function to decide order between to elements </summary>
    /// <param name="first"> - Address of the first element to compare </param>
    /// <param name="second"> - Address of the second element to compare </param>
    /// <returns> Order between two elements, based on the current direction </returns>
    const int compareElements(juce::XmlElement* first, juce::XmlElement* second) const;

private:

    // Attribute to be used for sorting
    juce::String attributeToSort;

    // Direction order "modifier"
    int direction;
};
