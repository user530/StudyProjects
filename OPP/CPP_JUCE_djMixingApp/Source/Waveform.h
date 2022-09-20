/*
  ==============================================================================

    Waveform.h
    Created: 4 Feb 2022 11:57:59am
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>
#include "StaticWaveform.h"
#include "DynamicWaveform.h"

//==============================================================================
/*
*/
class Waveform
{
public:

    // Constructor
    Waveform(juce::AudioFormatManager& formatManagerAdr,    // Access to the AudioFormatManager
             juce::AudioThumbnailCache& thumbCacheAdr,      // Access to the AudioThumbnailCache
                        StaticWaveform* statWaveform,       // Connect Static Waveform component
                        DynamicWaveform* dynWaveform);      // Connect Dynamic Waveform component

    // Destructor
    ~Waveform();

    //==================================================================

    /// <summary> Update waveform components (static and dynamic) </summary>
    void updateWaveforms();

    /// <summary> Update playhead relative position </summary>
    /// <param name="relPos"> - New relative playhead position </param>
    void setRelPos(const double relPos);

    /// <summary> Set track name visible in the static waveform component </summary>
    /// <param name="name"> - Track name </param>
    void setTrackName(const juce::String name);

    /// <summary> Set track BPM (rhytm as Beats Per Minute) visible in the dynamic waveform component </summary>
    /// <param name="bpm"> - Track BPM </param>
    void setTrackBPM(const double bpm);

    /// <summary> Get track BPM value from the dynamic waveform component </summary>
    /// <returns> Current track rhytm as Beats Per Minute </returns>
    const double getTrackBPM() const;

    /// <summary> Set track length in the format "Minutes : Seconds", visible in the static waveform component </summary>
    /// <param name="maxLen"> - Track length in seconds </param>
    void setTrackLength(const int maxLen);

    /// <summary> Set current playback position in seconds </summary>
    /// <param name="newTime"> - playback position in seconds </param>
    void setCurTime(const double newTime);

    /// <summary> Pass new audio thumb to the static and dynamic waveform components for the visualisation </summary>
    void setNewThumb();

    /// <summary> Get access to the audio thumbnail, so GUI can attach listener </summary>
    /// <returns> Adress of the AudioThumbnail object </returns>
    juce::AudioThumbnail* getAudioThumb();

    /// <summary> Callback to update the visible range of the dynamic waveform </summary>
    void updateVisRange();                                            

private:

    // Audio Thumbnail object to store waveforms of the tracks
    juce::AudioThumbnail audioThumb;

    // Address of the static waveform component
    StaticWaveform* statWaveform;

    // Address of the dynamic waveform component
    DynamicWaveform* dynWaveform;

    // Current relative position 
    double curPos;

    // Current playback time
    double curTime;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Waveform)
};
