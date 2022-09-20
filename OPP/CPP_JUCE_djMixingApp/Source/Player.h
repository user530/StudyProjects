/*
  ==============================================================================

    Player.h
    Created: 4 Feb 2022 11:56:53am
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>


//==============================================================================


//==============================================================================
/*
*/
class Player  : public juce::AudioSource
{               
public:
    Player(juce::AudioFormatManager&);
    ~Player() override;

    //==================================================================
    // Enum class to store all available player states
    enum class PlayerState
    {
        Stopped,
        Starting,
        Playing,
        Stopping,
        Pausing,
        Paused
    };

    //==================================================================
    // Override pure virtual functions from the AudioSource parent class

    // Tells the source to prepare for playing
    virtual void prepareToPlay(int samplesPerBlockExpected, double sampleRate) override;

    // Allows the source to release anything it no longer needs after playback has stopped
    virtual void releaseResources() override;

    // Called repeatedly to fetch subsequent blocks of audio data
    virtual void getNextAudioBlock(const juce::AudioSourceChannelInfo& bufferToFill) override;

    //==================================================================

    /// <summary> Function to handle changes in player state </summary>
    /// <param name="newState"> - Set new player state </param>
    void changeState(PlayerState newState);

    /// <summary> Function to check the player state </summary>
    /// <returns> Current player state </returns>
    PlayerState getState() const;

    /// <summary> Attempts to open the file from the URL passed </summary>
    /// <param name="audioURL"> - URL to the audio file </param>
    /// <returns> True if file opened successfully, false - otherwise </returns>
    const bool openFile(juce::URL audioURL);

    /// <summary> Provide access to the transport source, so GUI can attach listener </summary>
    /// <returns> Pointer to the AudioTransportSource </returns>
    juce::AudioTransportSource* getTransportSource();

    /// <summary> Checks that reader source is not empty </summary>
    /// <returns> True if reader is not empty, false - otherwise </returns>
    const bool rdrSrcNotEmpty() const;

    /// <summary> Set new gain(volume) value </summary>
    /// <param name="newValue"> - New gain value, from 0 to 3.0 (300%) </param>
    void setGain(float newValue);

    /// <summary> Set playback position based on the relative position </summary>
    /// <param name="relStamp"> - Relative playback position (from 0.0 to 1.0) </param>
    void setPosRel(float relStamp);

    /// <summary> Get current relative position </summary>
    /// <returns> Relative position of the current playback time to the total length </returns>
    const double getPosRel() const;

    /// <summary> Set playback position based on time stamp </summary>
    /// <param name="timeStamp"> - Playback position in seconds </param>
    void setPos(float timeStamp);

    /// <summary> Set playback tempo </summary>
    /// <param name="tempo"> - New tempo value, from 0.1 (10%) to 8 (800%)</param>
    void setTempo(double tempo);

    /// <summary> Get current player tempo </summary>
    /// <returns> Current player tempo value </returns>
    const double getTempo() const;
    
    /// <summary> Get player loop state </summary>
    /// <returns> True if looping is enabled, false - otherwise </returns>
    const bool isLooping() const;

    /// <summary> Set loop state </summary>
    /// <param name="willLoop"> - Loop setting flag </param>
    void setLooping(bool willLoop);

    /// <summary> Set edit mode </summary>
    /// <param name="isEditable"> - Hot cue edit mode flag</param>
    void setCueEdit(bool isEditable);

    /// <summary> Get hot cues edit mode status </summary>
    /// <returns> True if editing is enabled, false - otherwise </returns>
    const bool getCueEdit() const;

    /// <summary> Set timestamp to the hot cue </summary>
    /// <param name="ind"> - Index of the hot cue </param>
    /// <param name="timestamp"> - Timestamp to set </param>
    void setHotCue(int ind, double timestamp);

    /// <summary> Get timestamp stored at the hot cue </summary>
    /// <param name="ind"> - Hot cue index </param>
    /// <returns> Timestamp stored </returns>
    const double getHotCue(int ind) const;

private:
    
    // Transport source
    juce::AudioTransportSource transportSource;

    // Format manager (we pass Manager to the player as reference)
    juce::AudioFormatManager& formatManager;

    // Smart pointer to store reader source
    std::unique_ptr<juce::AudioFormatReaderSource> readerSource; 

    // Resampling source to allow changes in tempo
    juce::ResamplingAudioSource resampleSource{&transportSource, false, 2};

    // Player state
    PlayerState state;

    // Player Loop mode
    bool loopMode;

    // Player Hot cue edit mode
    bool cueEditMode;

    // Hot cue's timestamp storage
    juce::Array<double> hotCues;


    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Player)
};
