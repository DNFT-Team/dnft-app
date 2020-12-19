// React and Semantic UI elements.
import React, { useState, useEffect } from 'react';
import { List, Form, Input, Button, Grid, Message } from 'semantic-ui-react';
// Pre-built Substrate front-end utilities for connecting to a node
// and making a transaction.
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';
// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';

// Our main Proof Of Existence Component which is exported.
export default function ProofOfExistence(props) {
  // Establish an API to talk to our Substrate node.
  const { api } = useSubstrate();
  // Get the 'selected user' from the `AccountSelector` component.
  const { accountPair } = props;
  // React hooks for all the state variables we track.
  // Learn more at: https://reactjs.org/docs/hooks-intro.html
  const [status, setStatus] = useState('');
  const [digest, setDigest] = useState('');
  const [owner, setOwner] = useState('');
  const [block, setBlock] = useState(0);
  const [price, setPriceValue] = useState(0);
  const [nft_info, setNFTInfo] = useState('');
  const [transfer_to, setTransferTo] = useState('');
  const [proof, setProof] = useState('');
  const [comment, setComment] = useState('');



  // Our `FileReader()` which is accessible from our functions below.
  let fileReader;

  // Takes our file, and creates a digest using the Blake2 256 hash function.
  const bufferToDigest = () => {
    // Turns the file content to a hexadecimal representation.
    const content = Array.from(new Uint8Array(fileReader.result))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const hash = blake2AsHex(content, 256);
    setDigest(hash);
  };

  // Callback function for when a new file is selected.
  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = bufferToDigest;
    fileReader.readAsArrayBuffer(file);
  };

  // React hook to update the 'Owner' and 'Block Number' information for a file.
  useEffect(() => {
    let unsubscribe;

    // Polkadot-JS API query to the `proofs` storage item in our pallet.
    // This is a subscription, so it will always get the latest value,
    // even if it changes.
    api.query.nftModule
      .nFTs(digest, (result) => {
        // Our storage item returns a tuple, which is represented as an array.
        setNFTInfo(result.toString());
      })
      .then((unsub) => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
    // This tells the React hook to update whenever the file digest changes
    // (when a new file is chosen), or when the storage subscription says the
    // value of the storage item has updated.
  }, [digest, api.query.nftModule]);

  // We can say a file digest is claimed if the stored block number is not 0.
  function isMinted() {
    return block !== 0;
  }

  // The actual UI elements which are returned from our component.
  return (
    <Grid.Column>
      <h1>NFT 流通</h1>
      {/* Show warning or success message if the file is or is not claimed. */}
      <Form success={!!digest && !isMinted()} warning={isMinted()}>
        <Form.Field>
          <Input
            fluid
            type="text"
            id="comment"
            state="comment"
            label="NFT哈希1"
            onChange={(_, { value }) => setComment(value)}
          />
          <Input
            fluid
            type="text"
            id="comment"
            state="comment"
            label="NFT哈希2"
            onChange={(_, { value }) => setComment(value)}
          />
          <Input
            fluid
            type="text"
            id="transfer_to"
            state="transfer_to"
            label="转出地址"
            onChange={(_, { value }) => setTransferTo(value)}
          />

        </Form.Field>
        {/* Buttons for interacting with the component. */}
        <Form.Field>
          {/* Button to create a claim. Only active if a file is selected,
          and not already claimed. Updates the `status`. */}
          <TxButton
            accountPair={accountPair}
            label={'AEX'}
            setStatus={setStatus}
            type='SIGNED-TX'
            disabled={isMinted() || !digest}
            attrs={{
              palletRpc: 'nftModule',
              callable: 'mintNft',
              inputParams: [digest, comment, price],
              paramFields: [true]
            }}
          />
          {/* Button to revoke a claim. Only active if a file is selected,
          and is already claimed. Updates the `status`. */}
          <TxButton
            accountPair={accountPair}
            label='BEX'
            setStatus={setStatus}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'nftModule',
              callable: 'burnNft',
              inputParams: [digest],
              paramFields: [true]
            }}
          />
          {/* Button to revoke a claim. Only active if a file is selected,
          and is already claimed. Updates the `status`. */}
          <TxButton
            accountPair={accountPair}
            label='CEX'
            setStatus={setStatus}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'nftModule',
              callable: 'transferNft',
              inputParams: [digest, transfer_to],
              paramFields: [true]
            }}
          />
          {/* Button to revoke a claim. Only active if a file is selected,
          and is already claimed. Updates the `status`. */}
          <TxButton
            accountPair={accountPair}
            label='DEX'
            setStatus={setStatus}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'nftModule',
              callable: 'createClass',
              inputParams: [proof, price],
              paramFields: [true]
            }}
          />

        </Form.Field>
        {/* Status message about the transaction. */}
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}


