/*
  ==============================================================================

    MetadataParser.h
    Created: 28 Feb 2022 5:47:11pm
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

class MetaParser : public juce::InputStream
{
public:
    MetaParser();
    ~MetaParser() override;

private:
    virtual juce::int64 getTotalLength() override;
    virtual bool isExhausted() override;
    virtual int read(void* destBuffer, int maxBytesToRead) override;
    virtual juce::int64 getPosition() override;
    virtual bool setPosition(juce::int64 newPosition) override;


};