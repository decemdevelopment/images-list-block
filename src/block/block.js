/**
 * BLOCK: Images List Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import {_get as get} from 'lodash'

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
  ToggleControl,
  PanelBody,
  PanelRow,
  SelectControl,
  TextControl,
  IconButton,
  Button,
} from "@wordpress/components";

import { useState, Fragment } from "@wordpress/element";

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const ALLOWED_MEDIA_TYPES = ["audio"];

const selectOptions = [
  { value: null, label: "Select an Option", disabled: true },
  { value: "a", label: "Dots" },
  { value: "b", label: "Numbers" },
  { value: "c", label: "None" },
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
  },
  edit: ({setAttributes, attributes, ...props}) => {
    const [defaultImage, setDefaultImage] = useState();
    const blockProps = useBlockProps();

    const handleAddPairs = () => {
      console.log('adding pairs');
      const blockListItems = [...attributes.blockListItems];
      blockListItems.push({
        pairText: '',
        imageUrl: ''
      });
      setAttributes({ blockListItems });
    };

    const handleRemovePairs = (index) => {
      const blockListItems = [...attributes.blockListItems];
      blockListItems.splice(index, 1);
      setAttributes({ blockListItems });
    };

    const handlePairsTextChange = (pairText, index) => {
      console.log('changing text inside pair input')
      const blockListItems = [...attributes.blockListItems];
      blockListItems[index].pairText = pairText;
      setAttributes({ blockListItems });
    };

    const handleUpdatePairImage = (img, index) => {
      console.log('handleUpdatePairImage ', img, index);
      const blockListItems = [...attributes.blockListItems];
      blockListItems[index].imageUrl = img.url;
      setAttributes({blockListItems});
      console.log('after pair image update: ', attributes)
    }

    const handleDefaultImage = (media) => {
      setAttributes({
        defaultImageId: media.id,
        defaultImageUrl: media.url
      })
    }

    const showImage = (e) => {
      console.log(e);
    }
    

    let pairsDisplay, renderListPairs;

    // const renderListPairs = (foo) => {
    //   if (foo.length) {
    //     return(
    //       foo.map(
    //         (pair, index) => {
    //           return (
    //             <Fragment key={index}>
    //               <TextControl
    //                 className="grf__location-pairText"
    //                 placeholder="Enter pair text"
    //                 value={foo[index].pairText}
    //                 onChange={(pairText) => handlePairsTextChange(pairText, index)}
    //               />
    //               {
    //                 pair.imageUrl != '' && (
    //                   <img src={pair.imageUrl} key={index} alt=""/>
    //                 )
    //               }
    //               <MediaUploadCheck>
    //                 <MediaUpload
    //                   onSelect={(img) => handleUpdatePairImage(img, index)}
    //                   allowedTypes={ALLOWED_MEDIA_TYPES}
    //                   value={index}
    //                   render={({ open }) => (
    //                     <Button onClick={open}>Open Media Library</Button>
    //                   )}
    //                 />
    //               </MediaUploadCheck>
    //               <IconButton
    //                 className="grf__remove-location-pairText"
    //                 icon="no-alt"
    //                 label="Delete location"
    //                 onClick={() => handleRemovePairs(index)}
    //               />
    //             </Fragment>
    //           );
    //         }
    //       )
    //     )
    //   }
    // }

    if (attributes.blockListItems.length) {
      renderListPairs = attributes.blockListItems.map(
        (pair, index) => {
          return (
            <Fragment key={index}>
              <PanelRow>
                <TextControl
                  className="grf__location-pairText"
                  placeholder="Enter pair text"
                  value={attributes.blockListItems[index].pairText}
                  onChange={(pairText) => handlePairsTextChange(pairText, index)}
                />
              </PanelRow>
              <PanelRow>
              {
                pair.imageUrl != '' && (
                  <img src={pair.imageUrl} key={index} alt=""/>
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
            </Fragment>
          );
        }
      );

      pairsDisplay = attributes.blockListItems.map(
        (pair, index) => (
          <span className='images-list-block__content-item js-images-list-item' data-index={index} key={index} onMouseEnter={showImage}>{pair.pairText}</span>
        )
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
            <select onChange={console.log("select changed")}>
              {selectOptions.map(({ label, value, disabled }) => {
                return (
                  <option value={value} disabled={disabled}>
                    {label}
                  </option>
                );
              })}
            </select>
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
        <h2>Block</h2>
        
        <div className="images-list-block">
          <div className="images-list-block__content">
            {pairsDisplay}
          </div>
          <div className="images-list-block__media">
            {attributes.defaultImageUrl && <img src={attributes.defaultImageUrl} />}
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <img 
                    src={pair.imageUrl}
                    key={`${pair.imageUrl}-${index}`}
                    className="images-list-block__media-item js-images-list-item"
                    data-list-index={index}
                    alt=""
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

    let pairsDisplay = attributes.blockListItems.map(
      (pair, index) => (
        <span className='images-list-block__content-item js-images-list-item' data-list-index={index} key={index}>{pair.pairText}</span>
      )
    );
    return(
      <div key="2" { ...blockProps } className={props.className}>
        <h2>Block</h2>
        
        <div className="images-list-block">
          <div className="images-list-block__content">
            {pairsDisplay}
          </div>
          <div className="images-list-block__media">
            {attributes.defaultImageUrl && <img src={attributes.defaultImageUrl} />}
            {
              attributes.blockListItems.map(
                (pair, index) => (
                  <img
                    src={pair.imageUrl}
                    key={`${pair.imageUrl}-${index}`}
                    className="images-list-block__media-item"
                    data-list-index={index}
                    alt=""
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
