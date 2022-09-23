/*
  ==============================================================================

    PlayerGUI.cpp
    Created: 4 Feb 2022 11:57:30am
    Author:  eosdu

  ==============================================================================
*/

#include <JuceHeader.h>
#include "PlayerGUI.h"

//==============================================================================
PlayerGUI::PlayerGUI(Player* _player,
                        Waveform* _waveform,
                        Library* _library) : 
    player(_player),                                    // Connect player component
    waveform(_waveform),                                // Connect waveform component
    library(_library),                                  // Connect library component
    CueBtns({&Cue1Btn, &Cue2Btn, &Cue3Btn, &Cue4Btn,    // Collect hot cue btns into array for easy access
                &Cue5Btn, &Cue6Btn, &Cue7Btn, &Cue8Btn})
{

    // Initialize and setup GUI elements
    
    initPlayBtn();
    initStopBtn();
    initLoadBtn();
    initGainSld();
    initTimeSld();
    initTempoSld();
    initGainLabel();
    initTimeLabel();
    initTempoLabel();
    initLoopBtn();
    initEditQBtn();
    initCueBtns();

    // Add change listener to the transport source
    player->getTransportSource()->addChangeListener(this);

    // Add change listener to the waveform
    waveform->getAudioThumb()->addChangeListener(this);

    // Start timer thread
    startTimerHz(40);
} 

PlayerGUI::~PlayerGUI()
{
}

void PlayerGUI::paint (juce::Graphics& g)
{
    // Clear the background
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));   
    
    // Set component border colour
    g.setColour (juce::Colours::grey);

    // Draw component borders
    g.drawRect (getLocalBounds(), 1);

}

void PlayerGUI::resized()
{
    // Set bounds for every GUI element

    playBtn.setBounds(getWidth()    * 0.1,
                      getHeight()   * 0.8,
                      getWidth()    * 0.3,
                      getHeight()   * 0.1);

    stopBtn.setBounds(getWidth()    * 0.1, 
                      getHeight()   * 0.9, 
                      getWidth()    * 0.3, 
                      getHeight()   * 0.1);

    loadBtn.setBounds(getWidth()    * 0.1,
                      getHeight()   * 0.65 ,
                      getWidth()    * 0.3,
                      getHeight()   * 0.1);

    timeSld.setBounds(getWidth()    * 0.2, 
                      getHeight()   * 0.0, 
                      getWidth()    * 0.8, 
                      getHeight()   * 0.1);

    timeLabel.setBounds(getWidth()  * 0.0,
                        getHeight() * 0.0,
                        getWidth()  * 0.2,
                        getHeight() * 0.1);

    gainSld.setBounds(getWidth()    * 0.0, 
                      getHeight()   * 0.1, 
                      getWidth()    * 0.5, 
                      getHeight()   * 0.5);

    gainLabel.setBounds(getWidth()  * 0.0,
                        getHeight() * 0.25,
                        getWidth()  * 0.5,
                        getHeight() * 0.1);

    tempoSld.setBounds(getWidth()   * 0.5,
                       getHeight()  * 0.1,
                       getWidth()   * 0.5,
                       getHeight()  * 0.5);

    tempoLabel.setBounds(getWidth() * 0.5,
                        getHeight() * 0.25,
                        getWidth()  * 0.5,
                        getHeight() * 0.1);

    loopBtn.setBounds(getWidth()    * 0.5,
                      getHeight()   * 0.65,
                      getWidth()    * 0.2,
                      getHeight()   * 0.1);

    cueEditBtn.setBounds(getWidth() * 0.7,
                         getHeight()* 0.65,
                         getWidth() * 0.2,
                         getHeight()* 0.1);

    // Iterate over hot cue btns
    for (int i = 0; i < CueBtns.size(); ++i)
    {
        // Calculate X and Y
        const int x = getWidth()    * (0.5 + (i % 4) * 0.1);
        const int y = getHeight()   * (0.8 + (int)(i / 4) * 0.1);

        // Set bounds for the button
        CueBtns[i]->setBounds(x, y, getWidth() * 0.1, getHeight() * 0.1);
    }
}

void PlayerGUI::changeListenerCallback(juce::ChangeBroadcaster* source)
{
    // If change fired by transport source
    if (source == player -> getTransportSource())
    {
        // Change player based on the state
        transpChange(player -> getTransportSource());
    }
    // If change fired by audio thumb
    else if(source == waveform -> getAudioThumb())
    {
        // Execute thumbnail change callback
        thumbChange();
    }
};

void PlayerGUI::timerCallback()
{
    // Update time
    waveform->setCurTime(player->getTransportSource()->getCurrentPosition());

    // Update playhead position
    waveform->setRelPos(player -> getPosRel());

    // Update visible range
    waveform->updateVisRange();
};

void PlayerGUI::playBtnClick() const
{
    // Get player state
    auto playerState = player->getState();

    // When player is not playing
    if (playerState == Player::PlayerState::Stopped ||
        playerState == Player::PlayerState::Paused)
    {
        // Start playing 
        player->changeState(Player::PlayerState::Starting);

    }
    // If player is playing already
    else if (playerState == Player::PlayerState::Playing)
    {
        // Pause instead
        player->changeState(Player::PlayerState::Pausing);

    }
};

void PlayerGUI::stopBtnClick()
{
    // If player is already paused
    if (player->getState() == Player::PlayerState::Paused)
    {
        // Stop completely
        player->changeState(Player::PlayerState::Stopped);

        // Set btn text to "Play" and "Stop"
        playBtn.setButtonText("Play");
        stopBtn.setButtonText("Stop");

        // Disable toggle state for the buttons
        playBtn.setToggleState(false, juce::dontSendNotification);
        stopBtn.setToggleState(false, juce::dontSendNotification);

        // Disable stop btn
        stopBtn.setEnabled(false);
    }
    // If else
    else 
    {
        // Pause
        player->changeState(Player::PlayerState::Stopping);
    }
};

void PlayerGUI::loadBtnClick()
{
    // Get selected file
    const juce::File track = library->getSelectedTrack();

    // Check that file exists
    if (track.existsAsFile())
    {
        // If file opened successfully
        if (player->openFile(juce::URL{ track }))
        {
            // Load track into the player
            fileLoaded(track, 
                        library->getSelectedName(), 
                        library->getSelectedBPM() * player->getTempo());
        }
    }
};

void PlayerGUI::fileLoaded(juce::File file, juce::String trackName, double bpm)
{
    // Change state
    player->changeState(Player::PlayerState::Stopped);

    // Enable btns after file is loaded
    playBtn.setEnabled(true);
    loopBtn.setEnabled(true);
    cueEditBtn.setEnabled(true);

    // Toggle off play and stop btns
    playBtn.setToggleState(false, juce::NotificationType::dontSendNotification);
    stopBtn.setToggleState(false, juce::NotificationType::dontSendNotification);

    // Iterate over all btns
    for (int i = 0; i < CueBtns.size(); ++i)
    {
        // Enable cue btn
        CueBtns[i]->setEnabled(true);

        // Reset stored data
        player->setHotCue(i, 0.0);
    }

    // Change text
    playBtn.setButtonText("Play");
    stopBtn.setButtonText("Stop");

    // Toggle all cueBtns off
    cueBtnsOff();

    // Restore loop setting
    player->setLooping(player->isLooping());
    
    // Pass the audio data to the AudioThumb object to draw the new waveform 
    waveform->getAudioThumb()->setSource(new juce::FileInputSource(file));

    // Pass new audio thumb to the static and dynamic components
    waveform->setNewThumb();

    // Pass new track name to the Waveform component
    waveform->setTrackName(trackName);

    // Pass new track BPM to the Waveform component
    waveform->setTrackBPM(bpm) ;

    // Pass track length to the Waveform component
    waveform->setTrackLength(
                                player->getTransportSource()->getLengthInSeconds());
};

void PlayerGUI::loopBtnClick()
{
    // Set new loop state based on the current state
    player->setLooping( !player->isLooping() );

    // Set button text depending on the btn state
    if (player->isLooping())
    {
        loopBtn.setButtonText("LOOP: ON");
    }
    else
    {
        loopBtn.setButtonText("LOOP: OFF");
    }
};

void PlayerGUI::gainSldChange() const
{
    //Get the value of the slider and converse type
    float newGain = (float) gainSld.getValue();

    // Set new gain level of the player
    player->getTransportSource()->setGain(newGain);
};

void PlayerGUI::timeSldChange() const
{
    //Get the value of the slider and converse type
    float newPos = (float)timeSld.getValue();

    // Set new timestamp
    player->setPosRel(newPos);
};

void PlayerGUI::tempoSldChange() const
{
    // Get the value of the slider
    double newTempo = tempoSld.getValue();

    // Modify BPM accordingly
    waveform->setTrackBPM(
                            waveform->getTrackBPM() * 
                                                        (newTempo / player->getTempo()));

    // Update visuals
    waveform->updateWaveforms();
    
    // Set new tempo
    player->setTempo(newTempo);
};

void PlayerGUI::cueEditClick()
{
    // Set cue edit mode
    player->setCueEdit( !player->getCueEdit());

    // Set button text depending on the edit state
    if (player->getCueEdit())
    {
        cueEditBtn.setButtonText("CUE EDIT: ON");
    }
    else
    {
        cueEditBtn.setButtonText("CUE EDIT: OFF");
    }
};

void PlayerGUI::hotCueClick(juce::TextButton* btnAddr) const
{
    // If no file loaded, do nothing and stop execution
    if (!(player->rdrSrcNotEmpty()))
        return;

    // Index of the clicked button
    const int ind = CueBtns.indexOf(btnAddr);

    // If edit mode is ON
    if (player->getCueEdit())
    {
        // Store current timestamp to the HotCue slot
        player->setHotCue(ind, player->getPosRel());

        // Set button state to indicate that Cue is loaded
        btnAddr->setToggleState(true, juce::NotificationType::dontSendNotification);
    }
    // If edit mode is OFF
    else
    {
        // If button is not loaded, do nothing and stop execution
        // We use button state to prevent loading 0.0 timestamp when file is reloaded
        if (!(btnAddr->getToggleState()))
            return;

        // Retrive timestamp
        double timestamp = player->getHotCue(ind);

        // Set player position to the timestamp
        player->setPosRel((float)timestamp);
    }
};

void PlayerGUI::transpChange(juce::AudioTransportSource* transpSrcP)
{   
    // Player state
    Player::PlayerState plState = player->getState();

    // If audio is currently playing
    if (transpSrcP->isPlaying())
    {
        // Set state accordingly
        player->changeState(Player::PlayerState::Playing);

        // Set btn text to "Pause" and "Stop"
        playBtn.setButtonText("Pause");
        stopBtn.setButtonText("Stop");

        // Disable toggle state for the buttons
        playBtn.setToggleState(false, juce::dontSendNotification);      
        stopBtn.setToggleState(false, juce::dontSendNotification);

        // Enable stop btn
        stopBtn.setEnabled(true);
    }
    // If player winding down
    else if ((plState == Player::PlayerState::Stopping) ||
                (plState == Player::PlayerState::Playing))
    {
        // Stop the player
        player->changeState(Player::PlayerState::Stopped);

        // Set btn text to "Play" and "Stop" and set colours
        playBtn.setButtonText("Play");
        stopBtn.setButtonText("Stop");

        // Disable toggle state for the buttons
        playBtn.setToggleState(false, juce::dontSendNotification);           
        stopBtn.setToggleState(false, juce::dontSendNotification);

        // Disable stop btn
        stopBtn.setEnabled(false);
    }
    // If user player pausing
    else if (plState == Player::PlayerState::Pausing)
    {
        // Pause the player
        player -> changeState(Player::PlayerState::Paused);

        // Set btn txt to "Resume" and "Reset"
        playBtn.setButtonText("Resume");
        stopBtn.setButtonText("Reset");

        // Enable toggle state for the buttons
        playBtn.setToggleState(true, juce::dontSendNotification);
        stopBtn.setToggleState(true, juce::dontSendNotification);
    }
};

void PlayerGUI::thumbChange()
{
    // Update visuals
    waveform->updateWaveforms();
};

void PlayerGUI::cueBtnsOff()
{
    // Iterate over all hot cue buttons 
    for (int i = 0; i < CueBtns.size(); ++i)
    {
        // Disable toggle state
        CueBtns[i]->setToggleState(false, juce::NotificationType::dontSendNotification);
    }
};

bool PlayerGUI::isInterestedInFileDrag(const juce::StringArray& files)
{
    return true;
};

void PlayerGUI::filesDropped(const juce::StringArray& files, int x, int y)
{
    // Check that only one file dropped
    if (files.size() == 1)
    {
        // File
        juce::File file{ files[0] };

        // If file opened successfully
        if (player->openFile(juce::URL{ file }))
        {
            // Load file, but without Audio analyzing logic we can't get name or BPM, so set filename and 0 bpm
            fileLoaded(file, 
                        file.getFileNameWithoutExtension(), 
                        0.0 * player->getTempo());
        }
    }
};

bool PlayerGUI::isInterestedInDragSource(const SourceDetails& dragSourceDetails)
{
    return true;
};

void PlayerGUI::itemDropped(const SourceDetails& dragSourceDetails)
{
    // Shortcut to the result array
    juce::Array<juce::var>* arr = dragSourceDetails.description.getArray();

    // Track URL
    const juce::String url = arr->getUnchecked(0).toString();

    // Track Name
    const juce::String name = arr->getUnchecked(1).toString();

    // Track BPM
    const double bpm = (double)arr->getUnchecked(2) * player->getTempo();

    // Try to get file from the stored address
    juce::File track{ url };

    // If file opened successfully
    if (player->openFile(juce::URL{ track }))
    {
        // Load track
        fileLoaded(track, name, bpm);
    };
};

bool PlayerGUI::shouldDrawDragImageWhenOver()
{
    return true;
};


void PlayerGUI::initPlayBtn()
{
    // Show element
    addAndMakeVisible(&playBtn);

    // Add callback for the click event
    playBtn.onClick = [this] { playBtnClick(); };

    // Disable control button on the start
    playBtn.setEnabled(false);

    // Set toggle colour
    playBtn.setColour(juce::TextButton::buttonOnColourId, juce::Colours::green);
};

void PlayerGUI::initStopBtn()
{
    // Show element
    addAndMakeVisible(&stopBtn);

    // Add callback for the click event
    stopBtn.onClick = [this] { stopBtnClick(); };

    // Disable control button on the start
    stopBtn.setEnabled(false);

    // Set toggle colour
    stopBtn.setColour(juce::TextButton::buttonOnColourId, juce::Colours::red);
};

void PlayerGUI::initLoadBtn()
{
    // Show element
    addAndMakeVisible(&loadBtn);

    // Add callback for the click event
    loadBtn.onClick = [this] { loadBtnClick(); };
};

void PlayerGUI::initGainSld()
{
    // Show element
    addAndMakeVisible(&gainSld);

    // Add callback for the change event
    gainSld.onValueChange = [this] { gainSldChange(); };

    // Setup gain slider
    gainSld.setRange(0.0, 3.0);
    gainSld.setValue(1.0);
    gainSld.setSliderStyle(juce::Slider::Rotary);
    gainSld.setRotaryParameters(juce::MathConstants<float>::pi * 1.2f,
        juce::MathConstants<float>::pi * 2.8f,
        false);
    gainSld.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 20);
    gainSld.setDoubleClickReturnValue(true, 1.0);
};

void PlayerGUI::initTimeSld()
{
    // Show element
    addAndMakeVisible(&timeSld);

    // Add callback for the change event
    timeSld.onValueChange = [this] { timeSldChange(); };

    // Setup time slider
    timeSld.setRange(0.0, 1.0);
    timeSld.setValue(0.0);
    timeSld.setTextBoxStyle(juce::Slider::TextBoxRight, false, 70, 20);
};

void PlayerGUI::initTempoSld()
{
    // Show element
    addAndMakeVisible(&tempoSld);

    // Add callback for the change event
    tempoSld.onValueChange = [this] { tempoSldChange(); };

    // Setup tempo slider
    tempoSld.setRange(0.1, 8.0);
    tempoSld.setValue(1);
    tempoSld.setSliderStyle(juce::Slider::Rotary);
    tempoSld.setRotaryParameters(juce::MathConstants<float>::pi * 1.2f,
        juce::MathConstants<float>::pi * 2.8f,
        false);
    tempoSld.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 20);
    tempoSld.setDoubleClickReturnValue(true, 1.0);
};

void PlayerGUI::initGainLabel()
{
    // Show element
    addAndMakeVisible(&gainLabel);

    // Setup label
    gainLabel.setJustificationType(juce::Justification::centred);
};

void PlayerGUI::initTimeLabel()
{
    // Show element
    addAndMakeVisible(&timeLabel);

    // Setup label
    timeLabel.setJustificationType(juce::Justification::centred);
};

void PlayerGUI::initTempoLabel()
{
    // Show element
    addAndMakeVisible(&tempoLabel);

    // Setup label
    tempoLabel.setJustificationType(juce::Justification::centred);
};

void PlayerGUI::initLoopBtn()
{
    // Show element
    addAndMakeVisible(&loopBtn);

    // Add callback for the click event
    loopBtn.onClick = [this] { loopBtnClick(); };

    // Disable control button on the start
    loopBtn.setEnabled(false);

    // Make button togglebale
    loopBtn.setClickingTogglesState(true);

    // Set toggle colour
    loopBtn.setColour(juce::TextButton::buttonOnColourId, juce::Colours::blue);
};

void PlayerGUI::initEditQBtn()
{
    // Show element
    addAndMakeVisible(&cueEditBtn);

    // Add callback for the click event 
    cueEditBtn.onClick = [this] { cueEditClick(); };

    // Disable control button on the start
    cueEditBtn.setEnabled(false);

    // Make button togglebale
    cueEditBtn.setClickingTogglesState(true);

    // Set toggle colour
    cueEditBtn.setColour(juce::TextButton::buttonOnColourId, juce::Colours::mediumvioletred);
};

void PlayerGUI::initCueBtns()
{
    // Iterate over all hot cue btns
    for (int i = 0; i < CueBtns.size(); ++i)
    {
        // Show element
        addAndMakeVisible(CueBtns[i]);

        // Add callback for the click event 
        CueBtns[i]->onClick = [this, i] { hotCueClick(CueBtns[i]); };

        // Disable control button on the start
        CueBtns[i]->setEnabled(false);

        // Set toggle colour
        CueBtns[i]->setColour(juce::TextButton::buttonOnColourId, juce::Colours::mediumvioletred);
    }
};