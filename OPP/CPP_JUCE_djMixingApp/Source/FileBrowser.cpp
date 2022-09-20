/*
  ==============================================================================

    FileBrowser.cpp
    Created: 4 Feb 2022 11:59:45am
    Author:  eosdu

  ==============================================================================
*/

#include <JuceHeader.h>
#include "FileBrowser.h"

//==============================================================================
FileBrowser::FileBrowser()
{
    // Show file tree
    addAndMakeVisible(&fileTree);

    // Setup file browser to show documents directory
    contentList.setDirectory(
        juce::File::getSpecialLocation(juce::File::userHomeDirectory),
        true, true);

    // File tree
    fileTree.setTitle("Files");

    // Start thread
    browserThread.startThread(3);
};

FileBrowser::~FileBrowser() {};

void FileBrowser::paint (juce::Graphics& g)
{
    // Clear the background
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));

    // Draw an outline around the component
    g.setColour (juce::Colours::grey);
    g.drawRect (getLocalBounds(), 1);
}

void FileBrowser::resized()
{
    // Make File tree component to take 100% of given space
    fileTree.setBounds(0, 0, getWidth(), getHeight());
}

juce::FileTreeComponent* FileBrowser::getFiletree()
{
    return &fileTree;
};