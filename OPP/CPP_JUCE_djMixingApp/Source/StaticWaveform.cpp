/*
  ==============================================================================

    StaticWaveform.cpp
    Created: 6 Mar 2022 2:42:25pm
    Author:  eosdu

  ==============================================================================
*/

#include <JuceHeader.h>
#include "StaticWaveform.h"

//==============================================================================
StaticWaveform::StaticWaveform() : audioThumb(nullptr),
                                    curTime(0.0),
                                    curPos(0.0),
                                    trackName(""),
                                    trackLength("")
{
}

StaticWaveform::~StaticWaveform()
{
}

void StaticWaveform::paint (juce::Graphics& g)
{
    // Clear the background
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));

    // If file not loaded
    if (audioThumb == nullptr)
    {
        // Callback for empty thumbnail
        paintIfEmpty(g);
    }
    // If loaded
    else
    {
        // Callback to draw waveform
        paintIfLoaded(g);
    }

    // Draw an outline around the component
    g.setColour(juce::Colours::grey);
    g.drawRect(getLocalBounds(), 1);
}

void StaticWaveform::resized()
{
}

void StaticWaveform::setAudioThumb(juce::AudioThumbnail* newAudioThumb)
{
    // If new AudioThumb is passed, set it
    if (audioThumb != newAudioThumb)
        audioThumb = newAudioThumb; 
};

void StaticWaveform::setCurTime(const double newTime)
{
    // If new current time is passed, set it
    if (curTime != newTime)
        curTime = newTime;
};

void StaticWaveform::setCurPos(const double newPos)
{
    // If new relative position is passed, set it
    if (curPos != newPos)
        curPos = newPos;
};

void StaticWaveform::setTrackName(const juce::String newTrackName)
{
    // If new track name is passed, set it
    if (trackName != newTrackName)
        trackName = newTrackName;
};

void StaticWaveform::setTrackLength(const int maxLen)
{
    // Set track length
    trackLength = juce::String((int)(maxLen / 60)) + ":" 
                + juce::String(maxLen % 60);
};

const juce::String StaticWaveform::getTimeString(const double curTime) const
{
    // Prepare current time
    juce::String trackCur = juce::String{ (int)(curTime / 60) } + ":" + juce::String((int)curTime % 60);

    // Construct timer string
    return trackCur + " / " + trackLength;
};

void StaticWaveform::paintIfLoaded(juce::Graphics& g)
{
    // Background color
    g.setColour(
        getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId)
    );

    // Fill background
    g.fillRect(getLocalBounds());

    // Waveform color
    g.setColour(juce::Colours::lawngreen);

    // Draw static waveform for the whole track
    audioThumb->drawChannel(g,
                            juce::Rectangle<int>{ 0,getHeight() / 2, getWidth(), getHeight() },
                            0.0,
                            audioThumb->getTotalLength(),
                            0,
                            1.0f);

    // Calculate position on the screen
    float absPos = (float) (curPos * getWidth());

    // Playhead color
    g.setColour(juce::Colours::red);

    // Draw the playhead for static waveform
    g.drawRect(absPos,
                (float) (getHeight() * 0.5),
                1.0f,
                (float)getHeight());

    // Text color
    g.setColour(juce::Colours::red);

    // Set font size
    g.setFont(28.0f);

    // Draw Song name and 
    g.drawFittedText(trackName + "  -   " + getTimeString(curTime),
                        juce::Rectangle<int>(0, 0, getWidth(), getHeight() * 0.5),
                        juce::Justification::centred, 
                        1);
};


void StaticWaveform::paintIfEmpty(juce::Graphics& g)
{
    // Background color
    g.setColour(
        getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId)
    );

    // Fill background
    g.fillRect(getLocalBounds());

    // Text color
    g.setColour(juce::Colours::lawngreen);

    // Set font size
    g.setFont(28.0f);

    // Print text   
    g.drawFittedText("NO TRACK LOADED", getLocalBounds(), juce::Justification::centred, 1);
};

