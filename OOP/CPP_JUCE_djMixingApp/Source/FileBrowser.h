/*
  ==============================================================================

    FileBrowser.h
    Created: 4 Feb 2022 11:59:45am
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

//==============================================================================
/*
*/
class FileBrowser  : public juce::Component
{
public:
    // Constructor
    FileBrowser();

    // Destructor
    ~FileBrowser() override;

    //==================================================================

    // Override functions from the Component base class

    // Components can override this method to draw their content
    void paint (juce::Graphics&) override;

    // Called when this component's size has been changed
    void resized() override;

    //==================================================================

    /// <summary> Provide access to the file tree component </summary>
    /// <returns> Access to the File Tree component </returns>
    juce::FileTreeComponent* getFiletree();

private:

    // Time thread for the File browser
    juce::TimeSliceThread browserThread{ "File Browser" };

    // Object for asynchronous file broswing
    juce::DirectoryContentsList contentList{ nullptr, browserThread };

    // File tree component
    juce::FileTreeComponent fileTree{ contentList };

    // URL address for the selected file
    juce::URL selectedFile;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (FileBrowser)
};
