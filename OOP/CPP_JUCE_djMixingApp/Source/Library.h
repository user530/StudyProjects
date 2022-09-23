/*
  ==============================================================================

    Library.h
    Created: 4 Feb 2022 12:00:01pm
    Author:  eosdu

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>
#include "FileBrowser.h"
#include "DataSorter.h"

//==============================================================================
/*
*/
class Library  : public juce::Component,
                    public juce::FileBrowserListener,
                    public juce::TableListBoxModel,
                    public juce::DragAndDropContainer,
                    public juce::FileDragAndDropTarget
{
public:
    /// <summary> Constructor </summary>
    /// <param name=""> - File browser component address </param>
    /// <param name=""> - Reference to the AudioFormatManager object </param>
    Library(FileBrowser*, juce::AudioFormatManager&);

    // Destructor
    ~Library() override;

    //==================================================================

    // Override functions from the Component base class

    // Components can override this method to draw their content
    void paint (juce::Graphics&) override;

    // Called when this component's size has been changed
    void resized() override;

    //==================================================================

    /// <summary> Get selected track </summary>
    /// <returns> Pointer to the selected track XML element </returns>
    const juce::XmlElement* getSelected() const;

    /// <summary> Get file path from the selected row </summary>
    /// <returns> Absolute path to the file </returns>
    const juce::File getSelectedTrack() const;

    /// <summary> Get track name from the selected row </summary>
    /// <returns> Track name from the table data </returns>
    const juce::String getSelectedName() const;

    /// <summary> Get track BPM from the selected row </summary>
    /// <returns> Track BPM from the table data </returns>
    const double getSelectedBPM() const;

private:
    //==================================================================

    // Override pure virtual functions from the base class FileBrowserListener

    // Callback when the user selects a different file in the browser
    virtual void selectionChanged() override;

    // Callback when the user clicks on a file in the browser
    virtual void fileClicked(const juce::File& file, const juce::MouseEvent& e) override;

    // Callback when the user double-clicks on a file in the browser
    virtual void fileDoubleClicked(const juce::File& file) override;

    // Callback when the browser's root folder changes
    virtual void browserRootChanged(const juce::File& newRoot) override;

    //===================================================================

    // Override virtual functions from the base class TableListBoxModel

    // This must return the number of rows currently in the table
    virtual int getNumRows() override;

    // This must draw the background behind one of the rows in the table
    virtual void paintRowBackground(juce::Graphics&, 
                                    int rowNumber, 
                                    int width, 
                                    int height, 
                                    bool rowIsSelected) override;

    // This must draw one of the cells
    virtual void paintCell(juce::Graphics&, 
                            int rowNumber, 
                            int columnId, 
                            int width, 
                            int height, 
                            bool rowIsSelected) override;

    // This callback is made when the user clicks on one of the cells in the table
    virtual void cellClicked(int rowNumber, int columnId, const juce::MouseEvent&);

    // This callback is made when the table's sort order is changed        
    virtual void sortOrderChanged(int newSortColumnId, bool isForwards);

    // Override this to be informed when the delete key 
    virtual void deleteKeyPressed(int lastRowSelected);
      
    // To allow rows from your table to be dragged - and -dropped, implement this method
    virtual juce::var getDragSourceDescription(const juce::SparseSet< int >& currentlySelectedRows);

    // This is used to create or update a custom component to go in a cell
    virtual juce::Component* refreshComponentForCell(int rowNumber,
                                                int columnId,
                                                bool isRowSelected,
                                                Component* existingComponentToUpdate) override;

    // Override this to be informed when rows are selected or deselected
    virtual void selectedRowsChanged(int lastRowSelected) override;

    //===================================================================

    // Custom component for the editable table cells
    class EditableTextCustomComponent;

    /// <summary> Get current text value from the selected cell </summary>
    /// <param name="columnNumber"> - Column number (starts from 1) </param>
    /// <param name="rowInd"> - Row index (starts from 0) </param>
    /// <returns> Text stored in the requested cell </returns>
    juce::String getText(const int columnNumber, const int rowInd) const;

    /// <summary> Set new value to the selected cell </summary>
    /// <param name="columnNumber"> - Column number (starts from 1) </param>
    /// <param name="rowInd"> - Row index (starts from 0) </param>
    /// <param name="newText"> - New text to set to the requested cell </param>
    void setText(const int columnNumber, const int rowInd, const juce::String& newText);
    
    //===================================================================

    // Override pure virtual functions from the base class FileDragAndDropTarget
    
    // Callback to check whether this target is interested in the set of files being offered
    virtual bool isInterestedInFileDrag(const juce::StringArray& files) override;

    // Callback to indicate that the user has dropped the files onto this component
    virtual void filesDropped(const juce::StringArray& files, int x, int y) override;

    //===================================================================

    /// <summary> Logic to open the library file </summary>
    /// <param name="libFile"> - Library file </param>
    void loadLibFile(juce::File& libFile);
    
    /// <summary> Logic to save the current library to the file </summary>
    /// <param name="libFile"> - Library file </param>
    void saveLibFile(juce::File& libFile);

    /// <summary> Setup XML library based on the library template </summary>
    /// <param name="emptyLib"> - Empty lib to fill according to the template </param>
    void libTemplate(juce::XmlElement* emptyLib);

    /// <summary> Add audio file to the current library </summary>
    /// <param name="file"> - Audio File (Correct formats are: mp3, wav, aiff) </param>
    void addTrackToLib(const juce::File& file);

    /// <summary> Add XML entry to the current library with passed params </summary>
    /// <param name="params"> Array of param values in form of strings </param>
    void makeLibEntry(const juce::StringArray params);

    /// <summary> Delete XML entry from the current library </summary>
    /// <param name="rowID"> - ID of the row to be deleted (as string) </param>
    void deleteLibEntry(const juce::String rowID);

    /// <summary> Restore library ID order in case of changes </summary>
    void orderLibID() const;

    /// <summary> Get attribute name based on the passed column number </summary>
    /// <param name="columnNumber"> - Column number to get information </param>
    /// <returns> Column name </returns>
    juce::String getColName(const int columnNumber) const;

    /// <summary> Update visible lib entries </summary>
    void updateVisible();

    /// <summary> Find the lib entry ID based on the visible entry index </summary>
    /// <param name="visibleInd"> Index of the visible track (relative) </param>
    /// <returns> ID of the track in the curent library as string </returns>
    const juce::String getAbsID(const int visibleInd) const;

    /// <summary> Get metadata from the file </summary>
    /// <param name="file"> - File to get metadata </param>
    /// <returns> Key - Value array of the metadata from the track </returns>
    juce::StringPairArray getMetadata(juce::File file);

    /// <summary> Callback function for the "Load lib" btn </summary>
    void loadLibClick();

    /// <summary> Callback function for the "Save lib" btn </summary>
    void saveLibClick();

    /// <summary> Callback function for the "Add track" btn </summary>
    void addTrackClick();

    /// <summary> Callback function for the "Del Track" btn </summary>
    void delTrackClick();

    /// <summary> Callback function for the "Search" field </summary>
    void searchChange();

    /// <summary> Callback function for the "Clear search bar" btn </summary>
    void clearSearch();

    //===================================================================

    // File browser component
    FileBrowser* fileBrowser;

    // Library table component
    juce::TableListBox libTable;

    // Current library xml
    juce::XmlElement curLibrary{ "OTODECKS_LIBRARY" };

    // Visible library entries
    juce::Array<juce::XmlElement*> visibleEntries;

    // Library structure xml element shortcut
    juce::XmlElement* libStructure = nullptr;

    // Library entries xml element shortcut
    juce::XmlElement* libEntries = nullptr;

    // Load library button
    juce::TextButton loadLibBtn{ "Load library" };

    // Save library button
    juce::TextButton saveLibBtn{ "Save library" };

    // Add track button
    juce::TextButton addTrackBtn{ "Add track" };

    // Del track button
    juce::TextButton delTrackBtn{ "Del track" };

    // Search (filter) library field
    juce::TextEditor searchField{ "Search field" };

    // Search (filter) library label
    juce::Label searchLabel{ "Search", "Filter:" };

    // Clear search field btn
    juce::TextButton clearSearchBtn{ "X" };

    // File chooser for library interactions
    std::unique_ptr<juce::FileChooser> fileChooserPtr = nullptr;

    // Shared format manager
    juce::AudioFormatManager& formatManager;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Library)
};


/// <summary> Custom component for the editable cell's of the lib table
/// (from the WidgetsDemo from the base JUCE demo collection, adapted to have DragAndDrop and such) </summary>
class Library::EditableTextCustomComponent : public juce::Label,
                                            public juce::DragAndDropContainer
{
public:
    Library::EditableTextCustomComponent(Library& td) : owner(td), row(-1), columnId(-1)
    {
        // double click to edit the label text; single click handled below
        setEditable(false, true, false);
    }

    // single click callback
    void mouseDown(const juce::MouseEvent& event) override
    {
        // single click on the label should simply select the row
        owner.libTable.selectRowsBasedOnModifierKeys(row, event.mods, false);

        Label::mouseDown(event);

        // Start drag and drop passing track information
        dragTrack();
    }

    // Function to drag track based on the element
    void dragTrack()
    {

        // Prepare result array
        juce::StringArray res{};

        // Entry shortcut
        juce::XmlElement* entry = owner.visibleEntries[row];

        // Add URL to the result
        res.add(entry->getStringAttribute("URL"));

        // Add name to the result
        res.add(entry->getStringAttribute("Track"));

        // BPM stored OR "default" value
        const juce::String BPM = entry->getStringAttribute("BPM").getDoubleValue() > 0 ?
            entry->getStringAttribute("BPM") :
            "0.0";

        // Add bpm to the result
        res.add(BPM);

        // On click start drag and drop, dragging file URL
        startDragging(res,
            this,
            juce::ScaledImage{},
            true);
    }

    void textWasEdited() override
    {
        owner.setText(columnId, row, getText());
    }

    // Our demo code will call this when we may need to update our contents
    void setRowAndColumn(const int newRow, const int newColumn)
    {
        row = newRow;
        columnId = newColumn;
        setText(owner.getText(columnId, row), juce::dontSendNotification);
    }

    void paint(juce::Graphics& g) override
    {
        auto& lf = getLookAndFeel();
        if (!dynamic_cast<juce::LookAndFeel_V4*> (&lf))
            lf.setColour(textColourId, juce::Colours::black);

        Label::paint(g);
    }

private:

    // Owner component
    Library& owner;

    // Row number and Column ID
    int row, columnId;
};