/**
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * ////////////// XEM FULL TUTORIAL TẠI ĐÂY https://shyft-insider.vercel.app/ ///////////////////////
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * Thay vì phải lên web shyft-insider để submit tx bằng code
 */
/* eslint-disable */
import axios from 'axios';
import { Blob } from 'buffer';
var fs = require('fs');

const YOUR_WALLET_ADDRESS = '7fbPDP3jAbkEVf7QAAxhBKHcbfLPttPkyXJNNkv62Xvd';
const SHYFT_API_KEY = '';
const network = 'devnet';
const collectionAddress = 'CcugSsxmGiXK1V7iScYK9zGYjxbjKuJhjEU1L2rptXwE';
const merkleTree = 'X5YZxkn4MmXqXwfJfmGvfucY2Ch217K59BURRVaHB5U';

async function createMerkleTree() {
  const response = await axios.post("https://api.shyft.to/sol/v1/nft/compressed/create_tree", {
    network,
    wallet_address: YOUR_WALLET_ADDRESS,
    max_depth_size_pair: {
      max_depth: 14,
      max_buffer_size: 64
    },
    canopy_depth: 11
  }, {
    headers: {
      "x-api-key": SHYFT_API_KEY
    }
  });
  console.dir(response.data, { depth: null })
}

/**
 * @api: https://docs.shyft.to/start-hacking/nft#create-v2
 * dùng API ver2 có thể config ví trả phí
 */
async function mintCollectionNFT() {
  const buffer = fs.readFileSync('./images.jpg');
  const blob = new Blob([buffer]);

  const formdata = new FormData();
  formdata.append('network', network);
  formdata.append('creator_wallet', YOUR_WALLET_ADDRESS);
  formdata.append('name', 'Lisa Anniversary');
  formdata.append('symbol', 'LA');
  formdata.append('description', '1 year anniversary album');
  formdata.append(
    'attributes',
    JSON.stringify([{ trait_type: 'owner', value: 'Lisa' }]),
  );
  formdata.append(
    'external_url',
    'https://mindforgex.relipa.vn/channel/lalisa/album/lisa-aniversary',
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formdata.append('image', blob, 'images.jpg');
  formdata.append('fee_payer', YOUR_WALLET_ADDRESS);

  const response = await axios.post(
    'https://api.shyft.to/sol/v2/nft/create',
    formdata,
    {
      headers: {
        'x-api-key': SHYFT_API_KEY,
      },
    },
  );
  console.dir(response.data, { depth: null });
}

/**
 * @api: https://docs.shyft.to/start-hacking/nft/compressed-nft#mint-compressed-nft
 */
async function mintCompressedNFT() {
  const response = await axios.post("https://api.shyft.to/sol/v1/nft/compressed/mint", 
  {
    network,
    creator_wallet: YOUR_WALLET_ADDRESS,
    "metadata_uri": "https://gateway.pinata.cloud/ipfs/QmYmUb5MHZwYovnQg9qANTJUi7R8VaE5CetfssczaSWn5K",
    merkle_tree: merkleTree,
    "is_delegate_authority": true,
    collection_address: collectionAddress,
    "max_supply": 1,
    "primary_sale_happend": true,
    "is_mutable": true,
    "receiver": YOUR_WALLET_ADDRESS,
    "fee_payer": YOUR_WALLET_ADDRESS
  },
   {
    headers: {
      "x-api-key": SHYFT_API_KEY
    }
  });

  console.dir(response.data, { depth: null })
}

/**
 * @api: https://docs.shyft.to/start-hacking/nft/compressed-nft#read-wallet-cnfts
 */
const fetchNFTsByWallet = () => {
  const nftUrl = `https://api.shyft.to/sol/v2/nft/compressed/read_all?network=${network}&wallet_address=${YOUR_WALLET_ADDRESS}&collection${collectionAddress}&&refresh=true&page=1&size=1`;
  axios({
    url: nftUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': SHYFT_API_KEY,
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log('fetchNFTsByWallet failed');
      console.warn(err);
    });
};

// createMerkleTree();
// mintCollectionNFT();
mintCompressedNFT();
// fetchNFTsByWallet();
