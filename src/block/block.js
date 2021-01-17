/**
 * BLOCK: Images List Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { registerBlockType } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import {
  RichText,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor'

import { ToggleControl, PanelBody, PanelRow, SelectControl, Button } from '@wordpress/components'

import { useState } from '@wordpress/element'

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const selectOptions = [
  { value: null, label: 'Select an Option', disabled: true },
  { value: 'a', label: 'Dots' },
  { value: 'b', label: 'Numbers' },
  { value: 'c', label: 'None' },
]

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
    blockListItems: {
      source: 'query',
      default: [],
      selector: '.item',
      query: {
        blockListContent: {
          type: 'string',
          source: 'html',
          selector: '.images-list-block__text'
        },
        index: {
          type: 'number',
          source: 'attribute',
          attribute: 'data-index'
        }
      }
    }
  },
  edit: ({ attributes, setAttributes, ...props }) => {

    const _cloneArray = (arr) => {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }

    const BlockList = attributes.blockListItems.sort(function (a, b) {
      return a.index - b.index;
    }).map(function (item) {
      return (
        <div className="item">
          <RichText
            tagName='h1'
            placeholder='Here the title goes...'
            value={item.title}
            autoFocus={true}
            onChange={
              (value) => {
                const newObject = Object.assign({}, item, {
                  title: value
                });
                return props.setAttributes({
                  blockListItems: [].concat(_cloneArray(props.attributes.blockListItems.filter(function (itemFilter) {
                    return itemFilter.index != item.index;
                  })), [newObject])
                });
              }
            }
          />
        </div>
      )
    });
    console.log(BlockList)
    return (
      <div className={props.className}>
        <div className="item-list">
          {BlockList.map((el) => {
            return el
          })}
          <Button className="btn add-row" onClick={() => {
            return setAttributes({
              blockListItems: [].concat(_cloneArray(props.attributes.blockListItems), [{
                index: props.attributes.blockListItems.length,
                blockListContent: ""
              }])
            });
          }}>Add Row</Button>
        </div>

      </div>
    )

    // return (
    //   <div className="cta-container">
    //     <InspectorControls>
    //       <PanelBody
    //         title="Block Settings"
    //         initialOpen={true}
    //       >
    //         <PanelRow>
    //           <SelectControl
    //             value={selection}
    //             onChange={setSelection}
    //             options={selectOptions}
    //           />
    //         </PanelRow>
    //         <PanelRow>
    //           <Button
    //             isPrimary
    //             onClick={() => {
    //               setAttributes(blockListItems)
    //             }}
    //           >
    //             {__('+ Add Item')}
    //           </Button>
    //         </PanelRow>
    //       </PanelBody>
    //     </InspectorControls>
    //     <div className="images-list-block">
    //       <div className="images-list-block__text">
    //         <ul>
    //           <li>Item 1</li>
    //           <li>Item 2</li>
    //           <li>Item 3</li>
    //         </ul>
    //       </div>
    //       <div className="images-list-block__media">
    //         <img src="https://via.placeholder.com/640x440&text=Image" alt="" />
    //       </div>
    //     </div>
    //   </div>
    // )
  },
  save: ({ attributes }) => {
    const { title, body } = attributes;

    return (
      <div className="images-list-block">
        <div className="images-list-block__text">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
        <div className="images-list-block__media">
          <img src="https://via.placeholder.com/640x440&text=Image" alt="" />
        </div>
      </div>
    )
  },
});
