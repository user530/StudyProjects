#pragma once

#include <JuceHeader.h>
#include "PlayerGUI.h"
#include "Waveform.h"
#include "StaticWaveform.h"
#include "DynamicWaveform.h"
#include "FileBrowser.h"
#include "Library.h"

//==============================================================================
/*
    This component lives inside our window, and this is where you should put all
    your controls and content.
*/
class MainComponent  : public juce::AudioAppComponent
{
public:
    //==============================================================================
    // Constructor and Destructor
    MainComponent();
    ~MainComponent() override;

    //==============================================================================
    // Override functions from the AudioAppComponent base class
    
    /// Tells the source to prepare for playing
    void prepareToPlay (int samplesPerBlockExpected, double sampleRate) override;

    // Called repeatedly to fetch subsequent blocks of audio data
    void getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill) override;

    // Allows the source to release anything it no longer needs after playback has stopped
    void releaseResources() override;

    //==============================================================================
    // Override virtual functions from the AudioAppComponent base class

    // Components can override this method to draw their content
    void paint (juce::Graphics& g) override;

    // Called when this component's size has been changed 
    void resized() override;


private:
    //==============================================================================

    // Universal format manager to pass for different components
    juce::AudioFormatManager formatManager;

    // Universal thumbnail cache
    juce::AudioThumbnailCache thumbCache{ 100 };    // Stores 100 thumbnails

    // Mixer object to handle 2 players
    juce::MixerAudioSource mixerSource;

    // Player components
    Player player1{ formatManager };
    Player player2{ formatManager };

    // Static waveforms
    StaticWaveform statWaveform1{};
    StaticWaveform statWaveform2{};

    // Dynamic waveforms
    DynamicWaveform dynamWaveform1{};
    DynamicWaveform dynamWaveform2{};

    // Waveform interface
    Waveform waveform1{ formatManager, thumbCache, &statWaveform1, &dynamWaveform1 };
    Waveform waveform2{ formatManager, thumbCache, &statWaveform2, &dynamWaveform2 };

    // Player GUI for every player
    PlayerGUI player1GUI{ &player1, &waveform1, &library};
    PlayerGUI player2GUI{ &player2, &waveform2, &library};

    // File browser interface
    FileBrowser fileBrowser;

    // Library interface
    Library library{&fileBrowser, formatManager};


    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (MainComponent)
};
