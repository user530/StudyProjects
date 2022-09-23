#include "MainComponent.h"

//==============================================================================
MainComponent::MainComponent()
{
    // Make sure you set the size of the component after
    // you add any child components.
    setSize (800, 600);

    // Some platforms require permissions to open input channels so request that here
    if (juce::RuntimePermissions::isRequired (juce::RuntimePermissions::recordAudio)
        && ! juce::RuntimePermissions::isGranted (juce::RuntimePermissions::recordAudio))
    {
        juce::RuntimePermissions::request (juce::RuntimePermissions::recordAudio,
                                           [&] (bool granted) { setAudioChannels (granted ? 2 : 0, 2); });
    }
    else
    {
        // Specify the number of input and output channels that we want to open
        setAudioChannels (2, 2);
    }

    // Register basic formats to be able to handle different audio files
    formatManager.registerBasicFormats();

    // Show application components (blocks)
    addAndMakeVisible(player1GUI);
    addAndMakeVisible(player2GUI);
    addAndMakeVisible(dynamWaveform1);
    addAndMakeVisible(dynamWaveform2);
    addAndMakeVisible(statWaveform1);
    addAndMakeVisible(statWaveform2);
    addAndMakeVisible(fileBrowser);
    addAndMakeVisible(library);
}

MainComponent::~MainComponent()
{
    // This shuts down the audio device and clears the audio source.
    shutdownAudio();
}

//==============================================================================
void MainComponent::prepareToPlay (int samplesPerBlockExpected, double sampleRate)
{
    // Add both players to the mixer
    mixerSource.addInputSource(&player1, false);
    mixerSource.addInputSource(&player2, false);

    // Prepare Player 1
    player1.prepareToPlay(samplesPerBlockExpected, sampleRate);

    // Prepare Player 2
    player2.prepareToPlay(samplesPerBlockExpected, sampleRate);
}

void MainComponent::getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill)
{
    // Pass the job to the mixer
    mixerSource.getNextAudioBlock(bufferToFill);
}

void MainComponent::releaseResources()
{
    // Clean up the mixer
    mixerSource.removeAllInputs();
    mixerSource.releaseResources();

    // Clean up the players
    player1.releaseResources();
    player2.releaseResources();
}

//==============================================================================
void MainComponent::paint (juce::Graphics& g)
{
    // (Our component is opaque, so we must completely fill the background with a solid colour)
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));
}

void MainComponent::resized()
{
    // Size values equal to the 10% of the application window Width AND Height
    const int wUnit = getWidth() / 10;
    const int hUnit = getHeight() / 10;

    // Set bounds of every application component (block)
    dynamWaveform1.setBounds        (0              , 0             , getWidth()    , hUnit         );                    
    dynamWaveform2.setBounds        (0              , hUnit         , getWidth()    , hUnit         );      
    statWaveform1.setBounds         (0              , hUnit * 2     , wUnit * 5     , hUnit         );
    statWaveform2.setBounds         (wUnit * 5      , hUnit * 2     , wUnit * 5     , hUnit         );
    player1GUI.setBounds            (0              , hUnit * 3     , wUnit * 5     , hUnit * 4     );
    player2GUI.setBounds            (wUnit * 5      , hUnit * 3     , wUnit * 5     , hUnit * 4     );
    fileBrowser.setBounds           (0              , hUnit * 7     , wUnit * 2.5   , hUnit * 3     );
    library.setBounds               (wUnit * 2.5    , hUnit * 7     , wUnit * 7.5   , hUnit * 3     );
}