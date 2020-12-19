import React, { useState, useEffect } from 'react';
import { List, Grid, Button, Input, Modal } from 'semantic-ui-react';

// Pre-built Substrate front-end utilities for connecting to a node
// and making a transaction.
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';
// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';

export default function Main(props) {
	const { api, keyring } = useSubstrate();
	const { accountPair } = props;
	// The transaction submission status
	const [status, setStatus] = useState('');

	// The currently stored value

	const [NFTList, setNFTList] = useState([]);
	const [NFTNumber, setNFTNumber] = useState([]);
	const [itemRenders, setItemRenders] = useState(0);

	const keyringOptions = keyring.getPairs().map((account) => ({
		key: account.address,
		value: account.address,
		text: account.meta.name.toUpperCase(),
		icon: 'user',
	}));

	const getKeyringName = (addr) => {
		let name = '';
		keyringOptions.map((value) => {
			if (name === '' && value.key === addr) {
				name = value.text;
			}
		});
		if (name !== '') return name;
		return addr;
	};

	useEffect(
		() => {
			let unsubscribe;
			if (accountPair) {
				api.query.nftModule
					.ownedNFTs(accountPair.address, (arr) => {
						if (arr.isNone) {
							setNFTList([]);
						} else {
							let list = arr.toJSON();

							setNFTList(list);
						}
					})
					.then((unsub) => {
						unsubscribe = unsub;
					})
					.catch(console.error);
			}
			return () => unsubscribe && unsubscribe();
		},
		[api.query.poe, accountPair],
	);

	useEffect(
		() => {
			getItemRenders(NFTList);
		},
		[accountPair, NFTList],
	);

	const getNFTDetails = async (NFT) => {
		let obj = await api.query.nftModule.nFTs(NFT);
		return !obj.isNone ? obj.unwrap().toJSON() : null;
	};

	const getItemRenders = async (NFTList) => {
		let list = [];
		for (var i = 0; i < NFTList.length; i++) {
			let NFT = NFTList[i];
			let NFT_info = await getNFTDetails(NFT);
			list.push(
				<List.Item key={i}>
					<br />
					<List.Content
						style={{
							padding: 20,
							backgroundColor: '#fff',
							fontSize: 18,
							color: '#333',
						}}
					>
						<div style={{ fontSize: 18 }}>
							<br />编号:{i}
							<br />nft_hash:{getKeyringName(NFT)}：
							<br />metadata:{NFT_info.metadata}
							<br />owner:{NFT_info.owner}
							<br />data:{NFT_info.data}
						</div>
						<br />

					</List.Content>
				</List.Item>,
			);
		}
		setItemRenders(list);
		setNFTNumber(list.length);
	};

	return (
		<Grid.Column
			style={{
				backgroundColor: '#eceefa',
				padding: 20,
			}}
		>
			<h1>我的 NFT{'(' + NFTNumber + ')'}</h1>
			<List>{itemRenders}</List>
			<div style={{ overflowWrap: 'break-word' }}>{status}</div>
		</Grid.Column>
	);
}




