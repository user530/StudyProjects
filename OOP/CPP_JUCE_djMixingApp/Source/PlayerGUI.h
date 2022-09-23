/*
  ==============================================================================

    PlayerGUI.h
    Created: 4 Feb 2022 11:57:30am
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>
#include "Player.h"
#include "Waveform.h"
#include "Library.h"

//==============================================================================
/*
*/
class PlayerGUI  : public juce::Component,
                    public juce::ChangeListener,
                    public juce::FileDragAndDropTarget,
                    public juce::DragAndDropTarget,
                    private juce::Timer
{
public:

    // Constructor
    PlayerGUI(Player* player,
              Waveform* waveform,
              Library* library);

    // Destructor
    ~PlayerGUI() override;

    //==================================================================

    // Override virtual functions from the Component base class

    // Components can override this method to draw their content
    void paint (juce::Graphics&) override;

    // Called when this component's size has been changed
    void resized() override;

    //==================================================================

    // Override pure virtual functions from the FileDragAndDropTarget base class

    // Callback to check whether this target is interested in the type of object being dragged
    virtual bool isInterestedInFileDrag(const juce::StringArray& files) override;

    // Callback to indicate that the user has dropped the files onto this component
    virtual void filesDropped(const juce::StringArray& files, int x, int y) override;

    //==================================================================

    // Override pure virtual functions from the DragAndDropTarget base class
    
    // Callback to check whether this target is interested in the type of object being dragged
    virtual bool isInterestedInDragSource(const SourceDetails& dragSourceDetails) override;

    // Callback to indicate that the user has dropped something onto this component
    virtual void itemDropped(const SourceDetails& dragSourceDetails) override;

    // Callback to indicate that the user has dropped something onto this component
    virtual bool shouldDrawDragImageWhenOver() override;

    //==================================================================

    // Override pure virtual functions from the ChangeListener base class
    
    // Your subclass should implement this method to receive the callback
    virtual void changeListenerCallback(juce::ChangeBroadcaster* source) override;

private:

    // Override pure virtual functions from the Timer base class
    virtual void timerCallback() override;

    /// <summary> Callback function for the play button click </summary>
    void playBtnClick() const;

    /// <summary> Callback function for the stop button click </summary>
    void stopBtnClick();

    /// <summary> Callback function for the load button click </summary>
    void loadBtnClick();

    /// <summary> Callback function for the loop button click </summary>
    void loopBtnClick();

    /// <summary> Update GUI when the new file loaded </summary>
    /// <param name="file"> - File path </param>
    /// <param name="trackName"> - Track name </param>
    /// <param name="bpm"> - Track BPM </param>
    void fileLoaded(juce::File file, juce::String trackName, double bpm);

    /// <summary> Callback function for the hotCue edit mode click </summary>
    void cueEditClick();

    /// <summary> Callback function for the hotCue button click </summary>
    /// <param name="btnAddr"> - Address of the callee button </param>
    void hotCueClick(juce::TextButton* btnAddr) const;

    /// <summary> Toggle off all hot cue btns </summary>
    void cueBtnsOff();

    /// <summary> Callback function for the gain slider </summary>
    void gainSldChange() const;

    /// <summary> Callback function for the time slider </summary>
    void timeSldChange() const;

    /// <summary> Callback function for the tempo slider </summary>
    void tempoSldChange() const;

    /// <summary> Logic behind changes of transport source </summary>
    /// <param name="transpSrcP"> - Address of the Audio Transport Source </param>
    void transpChange(juce::AudioTransportSource* transpSrcP);

    /// <summary> Logic behind changes of the thumbnail </summary>
    void thumbChange();

    /// <summary> Initialize the play button </summary>
    void initPlayBtn();

    /// <summary> Initialize the stop button </summary>
    void initStopBtn();

    /// <summary> Initialize the load button </summary>
    void initLoadBtn();

    /// <summary> Initialize the gain slider </summary>
    void initGainSld();

    /// <summary> Initialize the time slider </summary>
    void initTimeSld();

    /// <summary> Initialize the tempo slider </summary>
    void initTempoSld();

    /// <summary> Initialize the gain label </summary>
    void initGainLabel();

    /// <summary> Initialize the time label </summary>
    void initTimeLabel();

    /// <summary> Initialize the tempo label </summary>
    void initTempoLabel();

    /// <summary> Initialize the loop button </summary>
    void initLoopBtn();

    /// <summary> Initialize the hot cue edit button </summary>
    void initEditQBtn();

    /// <summary> Initialize the hot cue buttons </summary>
    void initCueBtns();


    // Start btn
    juce::TextButton playBtn{ "Play" };

    // Stop btn
    juce::TextButton stopBtn{ "Stop" };

    // Load from the lib btn
    juce::TextButton loadBtn{ "Load selected" };
    
    // Switch Loop mode btn
    juce::TextButton loopBtn{ "LOOP: OFF" };                                    

    // Switch Hot cue edit mode btn
    juce::TextButton cueEditBtn{ "CUE EDIT: OFF" };

    // Hot cue btns
    juce::Array<juce::TextButton*> CueBtns;
    juce::TextButton Cue1Btn{ "1" };
    juce::TextButton Cue2Btn{ "2" };
    juce::TextButton Cue3Btn{ "3" };
    juce::TextButton Cue4Btn{ "4" };
    juce::TextButton Cue5Btn{ "5" };
    juce::TextButton Cue6Btn{ "6" };
    juce::TextButton Cue7Btn{ "7" };
    juce::TextButton Cue8Btn{ "8" };

    // Gain (volume) slider
    juce::Slider gainSld;

    // Gain label
    juce::Label gainLabel{"Gain", "Gain:"};

    // Time slider
    juce::Slider timeSld;

    // Time label
    juce::Label timeLabel{"Time", "Time:"};
    
    // Tempo slider
    juce::Slider tempoSld;

    // Tempo label
    juce::Label tempoLabel{"Tempo", "Tempo:"};

    // Connect player component
    Player* player;

    // Connect audio thumb container component
    Waveform* waveform;

    // Connect library component
    Library* library;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (PlayerGUI)
};
