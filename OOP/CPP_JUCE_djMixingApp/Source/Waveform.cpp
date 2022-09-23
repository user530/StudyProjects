/*
  ==============================================================================

    Waveform.cpp
    Created: 4 Feb 2022 11:57:59am
    Author:  eosdu

  ==============================================================================
*/

#include <JuceHeader.h>
#include "Waveform.h"

//==============================================================================
Waveform::Waveform(juce::AudioFormatManager& formatManagerAdr,
                   juce::AudioThumbnailCache& thumbCacheAdr,
                                StaticWaveform* _statWaveform,
                                DynamicWaveform* _dynWaveform) :
        audioThumb(1024,                        // Create AudioThumbnail
                    formatManagerAdr,
                    thumbCacheAdr),
        statWaveform(_statWaveform),            // Connect Static waveform component
        dynWaveform(_dynWaveform),              // Connect Dynamic waveform component
        curPos(0.0),                            // Initialize current relative position
        curTime(0.0)                            // Initialize current playback time
{
}

Waveform::~Waveform()
{
}

void Waveform::updateWaveforms()
{
    // Set new time
    statWaveform->setCurTime(curTime);
    dynWaveform->setCurTime(curTime);

    // Set new position for the static waveform playhead
    statWaveform->setCurPos(curPos);

    // Update visuals
    statWaveform->repaint();
    dynWaveform->repaint();
};

void Waveform::setNewThumb()
{
    // Pass audio thumb address to the static waveform
    statWaveform->setAudioThumb(&audioThumb);

    // Pass audio thumb address to the dynamic waveform
    dynWaveform->setAudioThumb(&audioThumb);

    // Initialize dynamic range
    dynWaveform->initRange();
};

juce::AudioThumbnail* Waveform::getAudioThumb()
{
    return &audioThumb;
};

void Waveform::setRelPos(const double relPos)
{
    // If relative position is differs from the current one
    if (curPos != relPos)
    {
        // Update position
        curPos = relPos;
    }
};

void Waveform::setTrackName(const juce::String name)
{
    // Pass the job to the static waveform
    statWaveform->setTrackName(name);
};


void Waveform::setTrackBPM(const double bpm)
{
    // Pass the job to the dynamic waveform
    dynWaveform->setTrackBPM(bpm);
};

const double Waveform::getTrackBPM() const
{
    // Pass the job to the dynamic waveform
    return dynWaveform->getTrackBPM();
};

void Waveform::updateVisRange()
{
    // Pass the job to the dynamic waveform
    dynWaveform->updateVisRange();

    // Update visuals
    updateWaveforms();                                                       
};

void Waveform::setTrackLength(const int maxLen) 
{
    // Pass the job to the static waveform
    statWaveform->setTrackLength(maxLen);
};

void Waveform::setCurTime(const double newTime)
{
    // If time changed
    if (curTime != newTime)
    {
        // Set new time
        curTime = newTime;
    }
};