const cbor = require('cbor');

const {
  abci: {
    ResponseQuery,
  },
} = require('abci/types');

/**
 *
 * @param {PublicKeyIdentityIdMapLevelDBRepository} publicKeyIdentityIdRepository
 * @param {IdentityLevelDBRepository} identityRepository
 * @return {identitiesByPublicKeyHashesQueryHandler}
 */
function identitiesByPublicKeyHashesQueryHandlerFactory(
  publicKeyIdentityIdRepository,
  identityRepository,
) {
  /**
   * @typedef identitiesByPublicKeyHashesQueryHandler
   * @param {Object} params
   * @param {Object} data
   * @param {Buffer[]} data.publicKeyHashes
   * @return {Promise<ResponseQuery>}
   */
  async function identitiesByPublicKeyHashesQueryHandler(params, { publicKeyHashes }) {
    const identities = await Promise.all(
      publicKeyHashes.map(async (publicKeyHash) => {
        const identityId = await publicKeyIdentityIdRepository.fetch(publicKeyHash);

        if (!identityId) {
          return Buffer.alloc(0);
        }

        const identity = await identityRepository.fetch(identityId);

        return identity.toBuffer();
      }),
    );

    return new ResponseQuery({
      value: await cbor.encodeAsync(identities),
    });
  }

  return identitiesByPublicKeyHashesQueryHandler;
}

module.exports = identitiesByPublicKeyHashesQueryHandlerFactory;