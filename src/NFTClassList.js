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

	const [NFTClassList, setNFTClassList] = useState([]);
	const [NFTClassNumber, setNFTClassNumber] = useState([]);
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
					.classList((arr) => {
						if (arr.isNone) {
							setNFTClassList([]);
						} else {
							let list = arr.toJSON();

							setNFTClassList(list);
						}
					})
					.then((unsub) => {
						unsubscribe = unsub;
					})
					.catch(console.error);
			}
			return () => unsubscribe && unsubscribe();
		},
		[api.query.nftModule, accountPair],
	);

	useEffect(
		() => {
			getItemRenders(NFTClassList);
		},
		[accountPair, NFTClassList],
	);

	const getNFTClassDetails = async (NFTClass) => {
		let obj = await api.query.nftModule.class(NFTClass);
		return !obj.isNone ? obj.unwrap().toJSON() : null;
	};

	const getItemRenders = async (NFTClassList) => {
		let list = [];
		for (var i = 0; i < NFTClassList.length; i++) {
			let NFTClass = NFTClassList[i];
			let NFTClass_info = await getNFTClassDetails(NFTClass);
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
							<br />类别哈希:{getKeyringName(NFTClass)}：
							<br />元数据:{NFTClass_info.metadata}
							<br />说明:{NFTClass_info.data}
							<br />创建者:{NFTClass_info.owner}
							<br />剩余数量:{NFTClass_info.total_issuance}
						</div>
						<br />

					</List.Content>
				</List.Item>,
			);
		}
		setItemRenders(list);
		setNFTClassNumber(list.length);
	};

	return (
		<Grid.Column
			style={{
				backgroundColor: '#eceefa',
				padding: 20,
			}}
		>
			<h1>NFTClass 类别列表{'(' + NFTClassNumber + ')'}</h1>
			<List>{itemRenders}</List>
			<div style={{ overflowWrap: 'break-word' }}>{status}</div>
		</Grid.Column>
	);
}




