/*
  ==============================================================================

    DynamicWaveform.cpp
    Created: 6 Mar 2022 2:43:07pm
    Author:  eosdu

  ==============================================================================
*/

#include <JuceHeader.h>
#include "DynamicWaveform.h"

//==============================================================================
DynamicWaveform::DynamicWaveform() : audioThumb(nullptr), 
                                        curTime(0.0),
                                        visibleRange(juce::Range<double>{}),
                                        visibleTimeSpread(20),
                                        bpm(0.0)
{
}

DynamicWaveform::~DynamicWaveform()
{
}

void DynamicWaveform::paint (juce::Graphics& g)
{
    // Clear the background
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));   // clear the background

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

void DynamicWaveform::resized()
{
}


void DynamicWaveform::paintIfLoaded(juce::Graphics& g)
{
    // Background color
    g.setColour(
        getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId)
    );

    // Fill background
    g.fillRect(getLocalBounds());

    // Visible range start value
    const double rangeStart = visibleRange.getStart();

    // Draw visible range waveform
    drawVisRange(g, rangeStart);

    // Draw beats over the waveform
    drawBeats(g, rangeStart);

};

void DynamicWaveform::paintIfEmpty(juce::Graphics& g)
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
    g.drawFittedText("NO WAVEFORM DETECTED", getLocalBounds(), juce::Justification::centred, 1);
};

void DynamicWaveform::setTrackBPM(const double newBpm)
{
    // If new BPM is passed, set it
    if (bpm != newBpm)
        bpm = newBpm;
};

const double DynamicWaveform::getTrackBPM() const
{
    return bpm;
};

void DynamicWaveform::setAudioThumb(juce::AudioThumbnail* newAudioThumb)
{
    // If new AudioThumb is passed, set it
    if (audioThumb != newAudioThumb)
        audioThumb = newAudioThumb;
};

void DynamicWaveform::setCurTime(const double newTime)
{
    // If new playback time is passed, set it
    if (curTime != newTime)
        curTime = newTime;
};

void DynamicWaveform::setVisRange(juce::Range<double> newRange)
{
    // Set new visible range
    visibleRange = newRange;
};

void DynamicWaveform::initRange()
{
    // Set initial range based on the track
    setVisRange(juce::Range<double>{0.0,
                                    audioThumb->getTotalLength()});
};

void DynamicWaveform::updateVisRange()
{
    // Update new visual range
    setVisRange(juce::Range<double>{curTime - visibleTimeSpread / 2,
                                    curTime + visibleTimeSpread / 2});
};

void DynamicWaveform::drawVisRange(juce::Graphics& g, const double rangeStart) const
{
    // Waveform color
    g.setColour(juce::Colours::lawngreen);

    // Set waveform opacity
    g.setOpacity(0.7);

    // Draw 'local' waveform for the current position
    audioThumb->drawChannel(g,
        getLocalBounds(),
        rangeStart,
        visibleRange.getEnd(),
        0,
        1.0f);

    // Playhead color
    g.setColour(juce::Colours::red);

    // Restore opacity
    g.setOpacity(1);

    // Draw the playhead for the dinamic waveform
    g.drawRect((float)getWidth() / 2 - 1.0,
        0.0,
        1.0f,
        (float)getHeight(),
        2.0f);
};

void DynamicWaveform::drawBeats(juce::Graphics& g, const double rangeStart) const
{
    // Check that BPM is correct
    if (bpm > 0)
    {
        // Beat frequency (1 beat every N seconds)
        const double beatFreq = 60.0 / bpm;

        // Scale in pix/sec
        const double scale = getWidth() / visibleRange.getLength();

        // Absolute X position of the first beat
        const double fBeatAbsX = abs(rangeStart - ceil(rangeStart / beatFreq) * beatFreq);

        // Absolute position of the current beat
        double beatX = fBeatAbsX;

        // Beat color
        g.setColour(juce::Colours::white);

        // Iterate while beat is visible
        for (int i = 0; beatX <= visibleTimeSpread; ++i)
        {
            // Calculate coordinate in Seconds
            beatX = fBeatAbsX + beatFreq * i;

            // Absolute "Index" of the first visible beat 
            int fBeatInd = ceil(rangeStart / beatFreq);

            // Mark each 4-th beat as bar
            const bool isBar = fmod(fBeatInd + i, 4) == 0;

            // Draw beat(bar) rect
            g.drawRect(beatX * scale - 1,
                isBar ? 0 : (float)getHeight() * 0.25,
                1.0f,
                isBar ? getHeight() : (float)getHeight() * 0.5,
                2.0f);
        }

        // Playhead color
        g.setColour(juce::Colours::red);

        // Set Font
        g.setFont(28.0f);

        //Draw BPM 
        g.drawText("Track BPM: " + juce::String(bpm),
            getLocalBounds().removeFromTop(getHeight() / 2),
            juce::Justification::centredLeft);
    }
};
