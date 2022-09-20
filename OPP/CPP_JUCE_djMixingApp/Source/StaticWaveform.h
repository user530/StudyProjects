/*
  ==============================================================================

    StaticWaveform.h
    Created: 6 Mar 2022 2:42:25pm
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

//==============================================================================
/*
*/
class StaticWaveform  : public juce::Component
{
public:
    // Constructor
    StaticWaveform();

    // Destructor
    ~StaticWaveform() override;

    //==================================================================

    // Override virtual functions from the Component base class

    // Components can override this method to draw their content
    void paint (juce::Graphics&) override;

    // Called when this component's size has been changed
    void resized() override;

    //==================================================================

    /// <summary> Draw static waveform, moving playhead, track name and time </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    void paintIfLoaded(juce::Graphics& g);

    /// <summary> Draw placeholder text when there is no track loaded </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    void paintIfEmpty(juce::Graphics& g);

    /// <summary> Set audio thumb to draw waveform </summary>
    /// <param name="newAudioThumb"> - Address of the AudioThumbnail object </param>
    void setAudioThumb(juce::AudioThumbnail* newAudioThumb);

    /// <summary> Set current playback position in seconds </summary>
    /// <param name="newTime"> - Playback position in seconds </param>
    void setCurTime(const double newTime);

    /// <summary> Set new position for the static waveform playhead </summary>
    /// <param name="newPos"> - New relative position </param>
    void setCurPos(const double newPos);

    /// <summary> Set track name visible in the static waveform component </summary>
    /// <param name="newTrackName"> - Track name </param>
    void setTrackName(const juce::String newTrackName);

    /// <summary> Set track length in the format "Minutes : Seconds", visible in the static waveform component </summary>
    /// <param name="maxLen"> - Track length in seconds </param>
    void setTrackLength(const int maxLen);

    /// <summary> Return playback time as a string </summary>
    /// <param name="curTime"> - Current time as double </param>
    /// <returns> Current time as string formated as "Current time / Total Time" </returns>
    const juce::String getTimeString(const double curTime) const;

private:

    // Address of the Audio Thumbnail object that stores waveforms of the tracks
    juce::AudioThumbnail* audioThumb;

    // Current playback time
    double curTime;

    // Current relative position 
    double curPos;

    // Current track name
    juce::String trackName;

    // Current track total length
    juce::String trackLength;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (StaticWaveform)
};
