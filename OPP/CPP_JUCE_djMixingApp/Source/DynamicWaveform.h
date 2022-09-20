/*
  ==============================================================================

    DynamicWaveform.h
    Created: 6 Mar 2022 2:43:07pm
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

//==============================================================================
/*
*/
class DynamicWaveform  : public juce::Component
{
public:
    // Constructor
    DynamicWaveform();

    // Destructor
    ~DynamicWaveform() override;

    //==================================================================

    // Override virtual functions from the Component base class

    // Components can override this method to draw their content
    void paint (juce::Graphics&) override;

    // Called when this component's size has been changed
    void resized() override;

    //==================================================================

    /// <summary> Draw dynamic waveform, and track BPM </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    void paintIfLoaded(juce::Graphics& g);

    /// <summary> Draw placeholder text when there is no track loaded </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    void paintIfEmpty(juce::Graphics& g);

    /// <summary> Set track BPM (rhytm as Beats Per Minute) visible in the dynamic waveform component </summary>
    /// <param name="newBpm"> - Track BPM </param>
    void setTrackBPM(const double newBpm);

    /// <summary> Get track BPM value from the dynamic waveform component </summary>
    /// <returns> Current track rhytm as Beats Per Minute </returns>
    const double getTrackBPM() const;

    /// <summary> Set audio thumb to draw waveform </summary>
    /// <param name="newAudioThumb"> - Address of the AudioThumbnail object </param>
    void setAudioThumb(juce::AudioThumbnail* newAudioThumb);

    /// <summary> Set current playback position in seconds </summary>
    /// <param name="newTime"> - playback position in seconds </param>
    void setCurTime(const double newTime);

    /// <summary> Set new visible range (part of the waveform that will be shown to the user at given time) </summary>
    /// <param name="newRange"> - New visible range </param>
    void setVisRange(juce::Range<double> newRange);

    /// <summary> Initialize range based on the loaded track </summary>
    void initRange();

    /// <summary> Callback to update the visible range of the dynamic waveform </summary>
    void updateVisRange();

    /// <summary> Draw visible part of the dynamic waveform </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    /// <param name="rangeStart"> - Start position of the visible range </param>
    void drawVisRange(juce::Graphics& g, const double rangeStart) const;

    /// <summary> Draw beats(bars) based on the BPM </summary>
    /// <param name="g"> - Graphics object to draw into </param>
    /// <param name="rangeStart"> - Start position of the visible range </param>
    void drawBeats(juce::Graphics& g, const double rangeStart) const;

private:

    // Address of the Audio Thumbnail object that stores waveforms of the tracks
    juce::AudioThumbnail* audioThumb;

    // Current playback time
    double curTime;

    // Range that will be drawn at the given time
    juce::Range<double> visibleRange;

    // "Time spread" (length) of the visible range
    unsigned int visibleTimeSpread;

    // BPM of the current track
    double bpm;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (DynamicWaveform)
};
