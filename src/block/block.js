/**
 * BLOCK: Images List Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import {
  RichText,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps
} from "@wordpress/block-editor";

import {
  PanelBody,
  PanelRow,
  TextControl,
  IconButton,
  Button,
} from "@wordpress/components";

import { useState, Fragment } from "@wordpress/element";

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const UL = ({children, ...props}) => <ul {...props}>{children}</ul>;
const OL = ({children, ...props}) => <ol {...props}>{children}</ol>;
const LI = ({children, ...props}) => <li {...props}>{children}</li>;
const DIV = ({children, ...props}) => <div {...props}>{children}</div>;

const ALLOWED_MEDIA_TYPES = ["image"];

const selectOptions = [
  { value: null, label: "Select an Option", disabled: true },
  { value: "dots", label: "Dots" },
  { value: "numbers", label: "Numbers" },
  { value: "none", label: "None" },
];

registerBlockType("images-list-block/example", {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __("Images List Block"), // Block title.
  icon: "shield", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [
    __("Example"),
    __("Decem Block"),
    __("Gutenberg Plugin Boilerplate"),
  ],
  attributes: {
    defaultImageId: {
     type: 'number',
     default: 0
    },
    defaultImageUrl: {
      type: 'string',
      default: ''
    },
    blockListItems: {
      type: "array",
      default: [],
      selector: ".item",
    },
    blockListType: {
      type: 'string',
      default: 'dots'
    }
  },
  edit: ({setAttributes, attributes, ...props}) => {
    const [listStyle, setListStyle] = useState();
    const blockProps = useBlockProps();

    const listTypeWrapper = {
      'dots': UL,
      'numbers': OL,
      'none': DIV,
    };
    
    const listTypeItem = {
      'dots': LI,
      'numbers': LI,
      'none': DIV,
    };

    const handleAddPairs = () => {
      const blockListItems = [...attributes.blockListItems];
      blockListItems.push({
        pairText: '',
        imageUrl: '',
        imageAlt: ''
      });
      setAttributes({ blockListItems });
    };

    const handleRemovePairs = (index) => {
      const blockListItems = [...attributes.blockListItems];
      blockListItems.splice(index, 1);
      setAttributes({ blockListItems });
    };

    const handlePairsTextChange = (pairText, index) => {
      const blockListItems = [...attributes.blockListItems];
      blockListItems[index].pairText = pairText;
      setAttributes({ blockListItems });
    };

    const handleUpdatePairImage = (img, index) => {
      const blockListItems = [...attributes.blockListItems];
      blockListItems[index].imageUrl = img.url;
      blockListItems[index].imageAlt = img.alt;
      setAttributes({blockListItems});
    }

    const handleDefaultImage = (media) => {
      setAttributes({
        defaultImageId: media.id,
        defaultImageUrl: media.url,
        defaultImageAlt: media.alt
      })
    }

    const handleSelect = (e) => {
      setAttributes({blockListType: e.target.value})
    }

    let renderListPairs;

    const listType = attributes.blockListType;

    const ListWrapper = listTypeWrapper[listType];
    const ListItem = listTypeItem[listType];

    if (attributes.blockListItems.length) {
      renderListPairs = attributes.blockListItems.map(
        (pair, index) => {
          return (
            <div key={index} style={{marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid #007cba'}}>
              <PanelRow>
                <div>
                  <label>List Item Text:</label>
                  <TextControl
                    className="grf__location-pairText"
                    placeholder="Enter pair text"
                    value={attributes.blockListItems[index].pairText}
                    onChange={(pairText) => handlePairsTextChange(pairText, index)}
                  />
                </div>
              </PanelRow>
              <PanelRow>
              {
                pair.imageUrl != '' && (
                  <img src={pair.imageUrl} key={index} alt={pair.imageAlt}/>
                )
              }
              </PanelRow>
              <PanelRow>
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(img) => handleUpdatePairImage(img, index)}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={index}
                    render={({ open }) => (
                      <Button onClick={open} isPrimary>{__("Add Image")}</Button>
                    )}
                  />
                </MediaUploadCheck>
                <IconButton
                  className="grf__remove-location-pairText"
                  icon="no-alt"
                  label="Delete location"
                  onClick={() => handleRemovePairs(index)}
                  isDestructive
                />
              </PanelRow>
            </div>
          );
        }
      );
    }

    
    return [
      <InspectorControls key="1">
        <PanelBody title={__("Block List Items")}>
          <PanelRow>
            <div>
              {attributes.defaultImageUrl != '' ? <img src={attributes.defaultImageUrl} /> : ''}
            </div>
          </PanelRow>
          <PanelRow>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={handleDefaultImage}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={attributes.defaultImageId}
                render={({ open }) => (
                  <Button isPrimary onClick={open}>{__("Add Default Image")}</Button>
                )}
              />
            </MediaUploadCheck>
          </PanelRow>

          <PanelRow>
            <div className="images-list-block-select">
              <label>List style:</label>
              <select onChange={handleSelect}>
                {selectOptions.map(({ label, value, disabled }) => {
                  return (
                    <option value={value} key={`${label}-${value}`} disabled={disabled}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </PanelRow>
          
          {renderListPairs}
          
          <PanelRow>
            <Button isDefault onClick={handleAddPairs}>
              {__("Add Pairs")}
            </Button>
          </PanelRow>
        </PanelBody>
      </InspectorControls>,
      <div key="2" { ...blockProps } className={props.className}>
        <div className="images-list-block">
          <ListWrapper className="images-list-block__content">
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <ListItem className='images-list-block__content-item js-images-list-item' data-list-index={index} key={`${pair}-${index}`}>{pair.pairText}</ListItem>
                )
              )
            }
          </ListWrapper>
          <div className="images-list-block__media">
            {attributes.defaultImageUrl && <img src={attributes.defaultImageUrl} alt={attributes.defaultImageAlt} />}
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <img 
                    src={pair.imageUrl}
                    key={`${pair.imageUrl}-${index}`}
                    className="images-list-block__media-item js-images-list-item"
                    data-list-index={index}
                    alt={pair.imageAlt}
                  />
                )
              )
            }
          </div>
        </div>
      </div>,
    ];
  },
  save: ({attributes, ...props}) => {
    const blockProps = useBlockProps.save();

    const listType = attributes.blockListType;

    const listTypeWrapper = {
      'dots': UL,
      'numbers': OL,
      'none': DIV,
    };
    
    const listTypeItem = {
      'dots': LI,
      'numbers': LI,
      'none': DIV,
    };

    const ListWrapper = listTypeWrapper[listType];
    const ListItem = listTypeItem[listType];
    
    return(
      <div key="2" { ...blockProps } className={props.className}>
        <div className="images-list-block">
          <ListWrapper className="images-list-block__content">
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <ListItem className='images-list-block__content-item js-images-list-item' data-list-index={index} key={`${pair}-${index}`}>{pair.pairText}</ListItem>
                )
              )
            }
          </ListWrapper>
          <div className="images-list-block__media">
            {attributes.defaultImageUrl && <img src={attributes.defaultImageUrl} alt={attributes.defaultImageAlt} />}
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <img
                    src={pair.imageUrl}
                    key={`${pair.imageUrl}-${index}`}
                    className="images-list-block__media-item"
                    data-list-image-index={index}
                    alt={pair.imageAlt}
                  />
                )
              )
            }
          </div>
        </div>
      </div>
    )
  },
});
