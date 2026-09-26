import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var RoundState;
(function (RoundState) {
  RoundState[RoundState['OPEN'] = 0] = 'OPEN';
  RoundState[RoundState['CLOSED'] = 1] = 'CLOSED';
  RoundState[RoundState['REVEALED'] = 2] = 'REVEALED';
})(RoundState || (RoundState = {}));

export var BetState;
(function (BetState) {
  BetState[BetState['ACTIVE'] = 0] = 'ACTIVE';
  BetState[BetState['CLAIMED'] = 1] = 'CLAIMED';
  BetState[BetState['REFUNDED'] = 2] = 'REFUNDED';
})(BetState || (BetState = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = new __compactRuntime.CompactTypeBytes(32);

class _UserAddress_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.bytes);
  }
}

const _descriptor_3 = new _UserAddress_0();

const _descriptor_4 = new __compactRuntime.CompactTypeEnum(2, 1);

class _Bet_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment()))));
  }
  fromValue(value_0) {
    return {
      roundId: _descriptor_1.fromValue(value_0),
      player: _descriptor_3.fromValue(value_0),
      ownerKey: _descriptor_2.fromValue(value_0),
      choiceCommitment: _descriptor_2.fromValue(value_0),
      state: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.roundId).concat(_descriptor_3.toValue(value_0.player).concat(_descriptor_2.toValue(value_0.ownerKey).concat(_descriptor_2.toValue(value_0.choiceCommitment).concat(_descriptor_4.toValue(value_0.state)))));
  }
}

const _descriptor_5 = new _Bet_0();

const _descriptor_6 = __compactRuntime.CompactTypeBoolean;

const _descriptor_7 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Round_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_6.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_8.alignment()))))));
  }
  fromValue(value_0) {
    return {
      commitment: _descriptor_2.fromValue(value_0),
      seed: _descriptor_2.fromValue(value_0),
      outcome: _descriptor_6.fromValue(value_0),
      state: _descriptor_7.fromValue(value_0),
      closeAt: _descriptor_1.fromValue(value_0),
      revealBy: _descriptor_1.fromValue(value_0),
      betCount: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.commitment).concat(_descriptor_2.toValue(value_0.seed).concat(_descriptor_6.toValue(value_0.outcome).concat(_descriptor_7.toValue(value_0.state).concat(_descriptor_1.toValue(value_0.closeAt).concat(_descriptor_1.toValue(value_0.revealBy).concat(_descriptor_8.toValue(value_0.betCount)))))));
  }
}

const _descriptor_9 = new _Round_0();

const _descriptor_10 = new __compactRuntime.CompactTypeVector(3, _descriptor_2);

const _descriptor_11 = new __compactRuntime.CompactTypeVector(4, _descriptor_2);

const _descriptor_12 = new __compactRuntime.CompactTypeVector(2, _descriptor_2);

class _Either_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_6.fromValue(value_0),
      left: _descriptor_2.fromValue(value_0),
      right: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.is_left).concat(_descriptor_2.toValue(value_0.left).concat(_descriptor_2.toValue(value_0.right)));
  }
}

const _descriptor_13 = new _Either_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.bytes);
  }
}

const _descriptor_14 = new _ContractAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_14.alignment().concat(_descriptor_3.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_6.fromValue(value_0),
      left: _descriptor_14.fromValue(value_0),
      right: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.is_left).concat(_descriptor_14.toValue(value_0.left).concat(_descriptor_3.toValue(value_0.right)));
  }
}

const _descriptor_15 = new _Either_1();

const _descriptor_16 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      keyOf(context, ...args_1) {
        return { result: pureCircuits.keyOf(...args_1), context };
      },
      roundCommit(context, ...args_1) {
        return { result: pureCircuits.roundCommit(...args_1), context };
      },
      choiceCommit(context, ...args_1) {
        return { result: pureCircuits.choiceCommit(...args_1), context };
      },
      outcomeOf(context, ...args_1) {
        return { result: pureCircuits.outcomeOf(...args_1), context };
      },
      registerPlayer: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`registerPlayer: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const address_0 = args_1[1];
        const playerSecret_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('registerPlayer',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 77 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(address_0) === 'object' && address_0.bytes.buffer instanceof ArrayBuffer && address_0.bytes.BYTES_PER_ELEMENT === 1 && address_0.bytes.length === 32)) {
          __compactRuntime.typeError('registerPlayer',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 77 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     address_0)
        }
        if (!(playerSecret_0.buffer instanceof ArrayBuffer && playerSecret_0.BYTES_PER_ELEMENT === 1 && playerSecret_0.length === 32)) {
          __compactRuntime.typeError('registerPlayer',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 77 char 1',
                                     'Bytes<32>',
                                     playerSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(address_0).concat(_descriptor_2.toValue(playerSecret_0)),
            alignment: _descriptor_3.alignment().concat(_descriptor_2.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._registerPlayer_0(context,
                                                partialProofData,
                                                address_0,
                                                playerSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      openRound: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`openRound: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        const closeAt_0 = args_1[2];
        const revealBy_0 = args_1[3];
        const operatorSecret_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('openRound',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 83 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('openRound',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 83 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        if (!(typeof(closeAt_0) === 'bigint' && closeAt_0 >= 0n && closeAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('openRound',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 83 char 1',
                                     'Uint<0..18446744073709551616>',
                                     closeAt_0)
        }
        if (!(typeof(revealBy_0) === 'bigint' && revealBy_0 >= 0n && revealBy_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('openRound',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'nightflip.compact line 83 char 1',
                                     'Uint<0..18446744073709551616>',
                                     revealBy_0)
        }
        if (!(operatorSecret_0.buffer instanceof ArrayBuffer && operatorSecret_0.BYTES_PER_ELEMENT === 1 && operatorSecret_0.length === 32)) {
          __compactRuntime.typeError('openRound',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'nightflip.compact line 83 char 1',
                                     'Bytes<32>',
                                     operatorSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(commitment_0).concat(_descriptor_1.toValue(closeAt_0).concat(_descriptor_1.toValue(revealBy_0).concat(_descriptor_2.toValue(operatorSecret_0)))),
            alignment: _descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._openRound_0(context,
                                           partialProofData,
                                           commitment_0,
                                           closeAt_0,
                                           revealBy_0,
                                           operatorSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closeRound: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`closeRound: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roundId_0 = args_1[1];
        const operatorSecret_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('closeRound',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 104 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('closeRound',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 104 char 1',
                                     'Uint<0..18446744073709551616>',
                                     roundId_0)
        }
        if (!(operatorSecret_0.buffer instanceof ArrayBuffer && operatorSecret_0.BYTES_PER_ELEMENT === 1 && operatorSecret_0.length === 32)) {
          __compactRuntime.typeError('closeRound',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 104 char 1',
                                     'Bytes<32>',
                                     operatorSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(roundId_0).concat(_descriptor_2.toValue(operatorSecret_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_2.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closeRound_0(context,
                                            partialProofData,
                                            roundId_0,
                                            operatorSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revealRound: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`revealRound: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roundId_0 = args_1[1];
        const seed_0 = args_1[2];
        const operatorSecret_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revealRound',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 117 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('revealRound',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 117 char 1',
                                     'Uint<0..18446744073709551616>',
                                     roundId_0)
        }
        if (!(seed_0.buffer instanceof ArrayBuffer && seed_0.BYTES_PER_ELEMENT === 1 && seed_0.length === 32)) {
          __compactRuntime.typeError('revealRound',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 117 char 1',
                                     'Bytes<32>',
                                     seed_0)
        }
        if (!(operatorSecret_0.buffer instanceof ArrayBuffer && operatorSecret_0.BYTES_PER_ELEMENT === 1 && operatorSecret_0.length === 32)) {
          __compactRuntime.typeError('revealRound',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'nightflip.compact line 117 char 1',
                                     'Bytes<32>',
                                     operatorSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(roundId_0).concat(_descriptor_2.toValue(seed_0).concat(_descriptor_2.toValue(operatorSecret_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revealRound_0(context,
                                             partialProofData,
                                             roundId_0,
                                             seed_0,
                                             operatorSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      placeBet: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`placeBet: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const address_0 = args_1[1];
        const roundId_0 = args_1[2];
        const choice_0 = args_1[3];
        const salt_0 = args_1[4];
        const playerSecret_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('placeBet',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(address_0) === 'object' && address_0.bytes.buffer instanceof ArrayBuffer && address_0.bytes.BYTES_PER_ELEMENT === 1 && address_0.bytes.length === 32)) {
          __compactRuntime.typeError('placeBet',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     address_0)
        }
        if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('placeBet',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'Uint<0..18446744073709551616>',
                                     roundId_0)
        }
        if (!(typeof(choice_0) === 'boolean')) {
          __compactRuntime.typeError('placeBet',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'Boolean',
                                     choice_0)
        }
        if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
          __compactRuntime.typeError('placeBet',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'Bytes<32>',
                                     salt_0)
        }
        if (!(playerSecret_0.buffer instanceof ArrayBuffer && playerSecret_0.BYTES_PER_ELEMENT === 1 && playerSecret_0.length === 32)) {
          __compactRuntime.typeError('placeBet',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'nightflip.compact line 131 char 1',
                                     'Bytes<32>',
                                     playerSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(address_0).concat(_descriptor_1.toValue(roundId_0).concat(_descriptor_6.toValue(choice_0).concat(_descriptor_2.toValue(salt_0).concat(_descriptor_2.toValue(playerSecret_0))))),
            alignment: _descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_6.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._placeBet_0(context,
                                          partialProofData,
                                          address_0,
                                          roundId_0,
                                          choice_0,
                                          salt_0,
                                          playerSecret_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claimWin: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`claimWin: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const betId_0 = args_1[1];
        const choice_0 = args_1[2];
        const salt_0 = args_1[3];
        const playerSecret_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimWin',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 160 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(betId_0) === 'bigint' && betId_0 >= 0n && betId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('claimWin',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 160 char 1',
                                     'Uint<0..18446744073709551616>',
                                     betId_0)
        }
        if (!(typeof(choice_0) === 'boolean')) {
          __compactRuntime.typeError('claimWin',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 160 char 1',
                                     'Boolean',
                                     choice_0)
        }
        if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
          __compactRuntime.typeError('claimWin',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'nightflip.compact line 160 char 1',
                                     'Bytes<32>',
                                     salt_0)
        }
        if (!(playerSecret_0.buffer instanceof ArrayBuffer && playerSecret_0.BYTES_PER_ELEMENT === 1 && playerSecret_0.length === 32)) {
          __compactRuntime.typeError('claimWin',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'nightflip.compact line 160 char 1',
                                     'Bytes<32>',
                                     playerSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(betId_0).concat(_descriptor_6.toValue(choice_0).concat(_descriptor_2.toValue(salt_0).concat(_descriptor_2.toValue(playerSecret_0)))),
            alignment: _descriptor_1.alignment().concat(_descriptor_6.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claimWin_0(context,
                                          partialProofData,
                                          betId_0,
                                          choice_0,
                                          salt_0,
                                          playerSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      refundExpired: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`refundExpired: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const betId_0 = args_1[1];
        const playerSecret_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('refundExpired',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 179 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(betId_0) === 'bigint' && betId_0 >= 0n && betId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('refundExpired',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 179 char 1',
                                     'Uint<0..18446744073709551616>',
                                     betId_0)
        }
        if (!(playerSecret_0.buffer instanceof ArrayBuffer && playerSecret_0.BYTES_PER_ELEMENT === 1 && playerSecret_0.length === 32)) {
          __compactRuntime.typeError('refundExpired',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 179 char 1',
                                     'Bytes<32>',
                                     playerSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(betId_0).concat(_descriptor_2.toValue(playerSecret_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_2.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._refundExpired_0(context,
                                               partialProofData,
                                               betId_0,
                                               playerSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      setPaused: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`setPaused: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const value_0 = args_1[1];
        const operatorSecret_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setPaused',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 195 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(value_0) === 'boolean')) {
          __compactRuntime.typeError('setPaused',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 195 char 1',
                                     'Boolean',
                                     value_0)
        }
        if (!(operatorSecret_0.buffer instanceof ArrayBuffer && operatorSecret_0.BYTES_PER_ELEMENT === 1 && operatorSecret_0.length === 32)) {
          __compactRuntime.typeError('setPaused',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'nightflip.compact line 195 char 1',
                                     'Bytes<32>',
                                     operatorSecret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_6.toValue(value_0).concat(_descriptor_2.toValue(operatorSecret_0)),
            alignment: _descriptor_6.alignment().concat(_descriptor_2.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setPaused_0(context,
                                           partialProofData,
                                           value_0,
                                           operatorSecret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      fundBankroll: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`fundBankroll: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amount_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fundBankroll',
                                     'argument 1 (as invoked from Typescript)',
                                     'nightflip.compact line 200 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('fundBankroll',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'nightflip.compact line 200 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(amount_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._fundBankroll_0(context,
                                              partialProofData,
                                              amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      registerPlayer: this.circuits.registerPlayer,
      openRound: this.circuits.openRound,
      closeRound: this.circuits.closeRound,
      revealRound: this.circuits.revealRound,
      placeBet: this.circuits.placeBet,
      claimWin: this.circuits.claimWin,
      refundExpired: this.circuits.refundExpired,
      setPaused: this.circuits.setPaused,
      fundBankroll: this.circuits.fundBankroll
    };
    this.provableCircuits = {
      registerPlayer: this.circuits.registerPlayer,
      openRound: this.circuits.openRound,
      closeRound: this.circuits.closeRound,
      revealRound: this.circuits.revealRound,
      placeBet: this.circuits.placeBet,
      claimWin: this.circuits.claimWin,
      refundExpired: this.circuits.refundExpired,
      setPaused: this.circuits.setPaused,
      fundBankroll: this.circuits.fundBankroll
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const operatorSecret_0 = args_0[1];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(operatorSecret_0.buffer instanceof ArrayBuffer && operatorSecret_0.BYTES_PER_ELEMENT === 1 && operatorSecret_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'nightflip.compact line 39 char 1',
                                 'Bytes<32>',
                                 operatorSecret_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('registerPlayer', new __compactRuntime.ContractOperation());
    state_0.setOperation('openRound', new __compactRuntime.ContractOperation());
    state_0.setOperation('closeRound', new __compactRuntime.ContractOperation());
    state_0.setOperation('revealRound', new __compactRuntime.ContractOperation());
    state_0.setOperation('placeBet', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimWin', new __compactRuntime.ContractOperation());
    state_0.setOperation('refundExpired', new __compactRuntime.ContractOperation());
    state_0.setOperation('setPaused', new __compactRuntime.ContractOperation());
    state_0.setOperation('fundBankroll', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(0n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(1n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(false),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(2n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(3n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(4n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(5n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(6n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(7n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(8n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(9n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._keyOf_0(operatorSecret_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(0n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(1n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(false),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(2n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(3n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_2),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_3 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(9n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _nativeToken_0() {
    return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_16.toValue(2n),
                                                                                                 alignment: _descriptor_16.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(time_0),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeGte_0(context, partialProofData, time_0) {
    return !this._blockTimeLt_0(context, partialProofData, time_0);
  }
  _sendUnshielded_0(context, partialProofData, color_0, amount_0, recipient_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(7n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_0),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(8n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_13.toValue(tmp_1),
                                                                                                alignment: _descriptor_13.alignment() },
                                                                                              { value: _descriptor_15.toValue(recipient_0),
                                                                                                alignment: _descriptor_15.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_0(recipient_0.left.bytes,
                      _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_16.toValue(0n),
                                                                                                             alignment: _descriptor_16.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_16.toValue(6n),
                                                                    alignment: _descriptor_16.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_2),
                                                                                                alignment: _descriptor_13.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(6n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_0),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _unshieldedBalanceLt_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_16.toValue(5n),
                                                                                                 alignment: _descriptor_16.alignment() } }] } },
                                                                      { dup: { n: 0 } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_0),
                                                                                                                             alignment: _descriptor_13.alignment() }).encode() } },
                                                                      'member',
                                                                      { branch: { skip: 3 } },
                                                                      'pop',
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      { jmp: { skip: 1 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_13.toValue(tmp_0),
                                                                                                 alignment: _descriptor_13.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _unshieldedBalanceGte_0(context, partialProofData, color_0, amount_0) {
    return !this._unshieldedBalanceLt_0(context,
                                        partialProofData,
                                        color_0,
                                        amount_0);
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_12, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_11,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _keyOf_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([110, 105, 103, 104, 116, 102, 108, 105, 112, 58, 107, 101, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0]);
  }
  _roundCommit_0(roundId_0, seed_0) {
    return this._persistentHash_1([new Uint8Array([110, 105, 103, 104, 116, 102, 108, 105, 112, 58, 114, 111, 117, 110, 100, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   __compactRuntime.convertFieldToBytes(32,
                                                                        roundId_0,
                                                                        'nightflip.compact line 54 char 5'),
                                   seed_0]);
  }
  _choiceCommit_0(choice_0, salt_0, ownerKey_0, roundId_0) {
    return this._persistentCommit_0([new Uint8Array([110, 105, 103, 104, 116, 102, 108, 105, 112, 58, 99, 104, 111, 105, 99, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     __compactRuntime.convertFieldToBytes(32,
                                                                          choice_0
                                                                          ?
                                                                          1n :
                                                                          0n,
                                                                          'nightflip.compact line 62 char 5'),
                                     ownerKey_0,
                                     __compactRuntime.convertFieldToBytes(32,
                                                                          roundId_0,
                                                                          'nightflip.compact line 64 char 5')],
                                    salt_0);
  }
  _outcomeOf_0(roundId_0, seed_0) {
    const digest_0 = this._persistentHash_1([new Uint8Array([110, 105, 103, 104, 116, 102, 108, 105, 112, 58, 111, 117, 116, 99, 111, 109, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                             __compactRuntime.convertFieldToBytes(32,
                                                                                  roundId_0,
                                                                                  'nightflip.compact line 71 char 5'),
                                             seed_0]);
    const t_0 = BigInt(digest_0[0n]); return t_0 >= 128n;
  }
  _registerPlayer_0(context, partialProofData, address_0, playerSecret_0) {
    __compactRuntime.assert(!_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_16.toValue(6n),
                                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(address_0),
                                                                                                                                               alignment: _descriptor_3.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Player already registered');
    const tmp_0 = this._keyOf_0(playerSecret_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(6n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(address_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(7n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_8.toValue(tmp_1),
                                                                alignment: _descriptor_8.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _openRound_0(context,
               partialProofData,
               commitment_0,
               closeAt_0,
               revealBy_0,
               operatorSecret_0)
  {
    __compactRuntime.assert(this._equal_1(this._keyOf_0(operatorSecret_0),
                                          _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_16.toValue(0n),
                                                                                                                                alignment: _descriptor_16.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Operator only');
    __compactRuntime.assert(!_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_16.toValue(1n),
                                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value),
                            'Game is paused');
    let t_0;
    if (t_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_16.toValue(2n),
                                                                                                    alignment: _descriptor_16.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value),
        t_0 > 0n)
    {
      let tmp_0;
      __compactRuntime.assert((tmp_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 0 } },
                                                                                                  { idx: { cached: false,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_16.toValue(2n),
                                                                                                                             alignment: _descriptor_16.alignment() } }] } },
                                                                                                  { popeq: { cached: false,
                                                                                                             result: undefined } }]).value),
                               _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_16.toValue(4n),
                                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_1.toValue(tmp_0),
                                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value)).state
                              !==
                              0,
                              'Previous round is open');
    }
    __compactRuntime.assert(closeAt_0 < revealBy_0, 'Invalid reveal deadline');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                closeAt_0),
                            'Close time must be in the future');
    const id_0 = ((t1) => {
                   if (t1 > 18446744073709551615n) {
                     throw new __compactRuntime.CompactError('nightflip.compact line 91 char 14: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                   }
                   return t1;
                 })(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_16.toValue(2n),
                                                                                                          alignment: _descriptor_16.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value)
                    +
                    1n);
    const tmp_1 = { commitment: commitment_0,
                    seed:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    outcome: false,
                    state: 0,
                    closeAt: closeAt_0,
                    revealBy: revealBy_0,
                    betCount: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(4n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(id_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_1),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(2n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(id_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _closeRound_0(context, partialProofData, roundId_0, operatorSecret_0) {
    __compactRuntime.assert(this._equal_2(this._keyOf_0(operatorSecret_0),
                                          _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_16.toValue(0n),
                                                                                                                                alignment: _descriptor_16.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Operator only');
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(4n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown round');
    const round_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_16.toValue(4n),
                                                                                                          alignment: _descriptor_16.alignment() } }] } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_1.toValue(roundId_0),
                                                                                                          alignment: _descriptor_1.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value);
    __compactRuntime.assert(round_0.state === 0, 'Round is not open');
    __compactRuntime.assert(this._blockTimeGte_0(context,
                                                 partialProofData,
                                                 round_0.closeAt),
                            'Betting window still open');
    const tmp_0 = { commitment: round_0.commitment,
                    seed: round_0.seed,
                    outcome: round_0.outcome,
                    state: 1,
                    closeAt: round_0.closeAt,
                    revealBy: round_0.revealBy,
                    betCount: round_0.betCount };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(4n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revealRound_0(context, partialProofData, roundId_0, seed_0, operatorSecret_0)
  {
    __compactRuntime.assert(this._equal_3(this._keyOf_0(operatorSecret_0),
                                          _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_16.toValue(0n),
                                                                                                                                alignment: _descriptor_16.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Operator only');
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(4n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown round');
    const round_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_16.toValue(4n),
                                                                                                          alignment: _descriptor_16.alignment() } }] } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_1.toValue(roundId_0),
                                                                                                          alignment: _descriptor_1.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value);
    __compactRuntime.assert(round_0.state === 1, 'Round is not closed');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                round_0.revealBy),
                            'Reveal deadline passed');
    __compactRuntime.assert(this._equal_4(this._roundCommit_0(roundId_0, seed_0),
                                          round_0.commitment),
                            'Seed does not match commitment');
    const tmp_0 = { commitment: round_0.commitment,
                    seed: seed_0,
                    outcome: this._outcomeOf_0(roundId_0, seed_0),
                    state: 2,
                    closeAt: round_0.closeAt,
                    revealBy: round_0.revealBy,
                    betCount: round_0.betCount };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(4n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _placeBet_0(context,
              partialProofData,
              address_0,
              roundId_0,
              choice_0,
              salt_0,
              playerSecret_0)
  {
    __compactRuntime.assert(!_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_16.toValue(1n),
                                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value),
                            'Game is paused');
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(6n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(address_0),
                                                                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Player is not registered');
    const key_0 = this._keyOf_0(playerSecret_0);
    __compactRuntime.assert(this._equal_5(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_16.toValue(6n),
                                                                                                                                alignment: _descriptor_16.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_3.toValue(address_0),
                                                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          key_0),
                            'Wrong player secret');
    __compactRuntime.assert(!this._equal_6(key_0,
                                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_16.toValue(0n),
                                                                                                                                 alignment: _descriptor_16.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'Operator cannot bet');
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(4n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown round');
    const round_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_16.toValue(4n),
                                                                                                          alignment: _descriptor_16.alignment() } }] } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_1.toValue(roundId_0),
                                                                                                          alignment: _descriptor_1.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value);
    __compactRuntime.assert(round_0.state === 0, 'Round is not open');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                round_0.closeAt),
                            'Betting deadline passed');
    let t_0;
    __compactRuntime.assert((t_0 = round_0.betCount, t_0 < 20n), 'Round is full');
    this._receiveUnshielded_0(context,
                              partialProofData,
                              this._nativeToken_0(),
                              1000000n);
    __compactRuntime.assert(this._unshieldedBalanceGte_0(context,
                                                         partialProofData,
                                                         this._nativeToken_0(),
                                                         ((t1) => {
                                                           if (t1 > 340282366920938463463374607431768211455n) {
                                                             throw new __compactRuntime.CompactError('nightflip.compact line 143 char 46: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                                                           }
                                                           return t1;
                                                         })(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                      partialProofData,
                                                                                                                      [
                                                                                                                       { dup: { n: 0 } },
                                                                                                                       { idx: { cached: false,
                                                                                                                                pushPath: false,
                                                                                                                                path: [
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_16.toValue(9n),
                                                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                                                       { popeq: { cached: false,
                                                                                                                                  result: undefined } }]).value)
                                                            +
                                                            1900000n)),
                            'Bankroll too low');
    const id_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                           partialProofData,
                                                                           [
                                                                            { dup: { n: 0 } },
                                                                            { idx: { cached: false,
                                                                                     pushPath: false,
                                                                                     path: [
                                                                                            { tag: 'value',
                                                                                              value: { value: _descriptor_16.toValue(3n),
                                                                                                       alignment: _descriptor_16.alignment() } }] } },
                                                                            { popeq: { cached: false,
                                                                                       result: undefined } }]).value);
    const tmp_0 = { roundId: roundId_0,
                    player: address_0,
                    ownerKey: key_0,
                    choiceCommitment:
                      this._choiceCommit_0(choice_0, salt_0, key_0, roundId_0),
                    state: 0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(5n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(id_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { commitment: round_0.commitment,
                    seed: round_0.seed,
                    outcome: round_0.outcome,
                    state: round_0.state,
                    closeAt: round_0.closeAt,
                    revealBy: round_0.revealBy,
                    betCount:
                      ((t1) => {
                        if (t1 > 65535n) {
                          throw new __compactRuntime.CompactError('nightflip.compact line 152 char 15: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                        }
                        return t1;
                      })(round_0.betCount + 1n) };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(4n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(roundId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_1),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = ((t1) => {
                    if (t1 > 18446744073709551615n) {
                      throw new __compactRuntime.CompactError('nightflip.compact line 154 char 15: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                    }
                    return t1;
                  })(id_0 + 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(3n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_2),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_3 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('nightflip.compact line 155 char 20: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_16.toValue(9n),
                                                                                                           alignment: _descriptor_16.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     +
                     1900000n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(9n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_4 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(8n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_8.toValue(tmp_4),
                                                                alignment: _descriptor_8.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return id_0;
  }
  _claimWin_0(context,
              partialProofData,
              betId_0,
              choice_0,
              salt_0,
              playerSecret_0)
  {
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(5n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(betId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown bet');
    const bet_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_16.toValue(5n),
                                                                                                        alignment: _descriptor_16.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(betId_0),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(bet_0.state === 0, 'Bet already settled');
    const key_0 = this._keyOf_0(playerSecret_0);
    __compactRuntime.assert(this._equal_7(bet_0.ownerKey, key_0),
                            'Wrong player secret');
    __compactRuntime.assert(this._equal_8(bet_0.choiceCommitment,
                                          this._choiceCommit_0(choice_0,
                                                               salt_0,
                                                               key_0,
                                                               bet_0.roundId)),
                            'Wrong choice or salt');
    let tmp_0;
    const round_0 = (tmp_0 = bet_0.roundId,
                     _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_16.toValue(4n),
                                                                                                           alignment: _descriptor_16.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(tmp_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value));
    __compactRuntime.assert(round_0.state === 2, 'Round not revealed');
    __compactRuntime.assert(choice_0 === round_0.outcome, 'Losing bet');
    __compactRuntime.assert(this._unshieldedBalanceGte_0(context,
                                                         partialProofData,
                                                         this._nativeToken_0(),
                                                         1900000n),
                            'Bankroll too low');
    const tmp_1 = { roundId: bet_0.roundId,
                    player: bet_0.player,
                    ownerKey: bet_0.ownerKey,
                    choiceCommitment: bet_0.choiceCommitment,
                    state: 1 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(5n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(betId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_0;
    const tmp_2 = (t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_16.toValue(9n),
                                                                                                               alignment: _descriptor_16.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                   (__compactRuntime.assert(t_0 >= 1900000n,
                                            'result of subtraction would be negative'),
                    t_0 - 1900000n));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(9n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    this._sendUnshielded_0(context,
                           partialProofData,
                           this._nativeToken_0(),
                           1900000n,
                           this._right_0(bet_0.player));
    return [];
  }
  _refundExpired_0(context, partialProofData, betId_0, playerSecret_0) {
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_16.toValue(5n),
                                                                                                                  alignment: _descriptor_16.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(betId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Unknown bet');
    const bet_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_16.toValue(5n),
                                                                                                        alignment: _descriptor_16.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(betId_0),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(bet_0.state === 0, 'Bet already settled');
    __compactRuntime.assert(this._equal_9(bet_0.ownerKey,
                                          this._keyOf_0(playerSecret_0)),
                            'Wrong player secret');
    let tmp_0;
    const round_0 = (tmp_0 = bet_0.roundId,
                     _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_16.toValue(4n),
                                                                                                           alignment: _descriptor_16.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(tmp_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value));
    __compactRuntime.assert(round_0.state !== 2, 'Round was revealed');
    __compactRuntime.assert(this._blockTimeGte_0(context,
                                                 partialProofData,
                                                 round_0.revealBy),
                            'Reveal deadline not reached');
    const tmp_1 = { roundId: bet_0.roundId,
                    player: bet_0.player,
                    ownerKey: bet_0.ownerKey,
                    choiceCommitment: bet_0.choiceCommitment,
                    state: 2 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_16.toValue(5n),
                                                                  alignment: _descriptor_16.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(betId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_0;
    const tmp_2 = (t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_16.toValue(9n),
                                                                                                               alignment: _descriptor_16.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                   (__compactRuntime.assert(t_0 >= 1900000n,
                                            'result of subtraction would be negative'),
                    t_0 - 1900000n));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(9n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    this._sendUnshielded_0(context,
                           partialProofData,
                           this._nativeToken_0(),
                           1000000n,
                           this._right_0(bet_0.player));
    return [];
  }
  _setPaused_0(context, partialProofData, value_0, operatorSecret_0) {
    __compactRuntime.assert(this._equal_10(this._keyOf_0(operatorSecret_0),
                                           _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_16.toValue(0n),
                                                                                                                                 alignment: _descriptor_16.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'Operator only');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(1n),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(value_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _fundBankroll_0(context, partialProofData, amount_0) {
    __compactRuntime.assert(amount_0 > 0n, 'Amount must be positive');
    this._receiveUnshielded_0(context,
                              partialProofData,
                              this._nativeToken_0(),
                              amount_0);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get operatorKey() {
      return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(0n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get paused() {
      return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(1n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get latestRoundId() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(2n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get nextBetId() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(3n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    rounds: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(4n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(4n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'nightflip.compact line 32 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(4n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'nightflip.compact line 32 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(4n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(key_0),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_9.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    bets: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(5n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(5n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'nightflip.compact line 33 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(5n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'nightflip.compact line 33 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(5n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(key_0),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    players: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(6n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(6n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'object' && key_0.bytes.buffer instanceof ArrayBuffer && key_0.bytes.BYTES_PER_ELEMENT === 1 && key_0.bytes.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'nightflip.compact line 34 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(6n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(key_0),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'object' && key_0.bytes.buffer instanceof ArrayBuffer && key_0.bytes.BYTES_PER_ELEMENT === 1 && key_0.bytes.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'nightflip.compact line 34 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_16.toValue(6n),
                                                                                                     alignment: _descriptor_16.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(key_0),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_3.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get playerCount() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(7n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get betCount() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(8n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get reservedPayout() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_16.toValue(9n),
                                                                                                   alignment: _descriptor_16.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {
  keyOf: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`keyOf: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('keyOf',
                                 'argument 1',
                                 'nightflip.compact line 47 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._keyOf_0(secret_0);
  },
  roundCommit: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`roundCommit: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const roundId_0 = args_0[0];
    const seed_0 = args_0[1];
    if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('roundCommit',
                                 'argument 1',
                                 'nightflip.compact line 51 char 1',
                                 'Uint<0..18446744073709551616>',
                                 roundId_0)
    }
    if (!(seed_0.buffer instanceof ArrayBuffer && seed_0.BYTES_PER_ELEMENT === 1 && seed_0.length === 32)) {
      __compactRuntime.typeError('roundCommit',
                                 'argument 2',
                                 'nightflip.compact line 51 char 1',
                                 'Bytes<32>',
                                 seed_0)
    }
    return _dummyContract._roundCommit_0(roundId_0, seed_0);
  },
  choiceCommit: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`choiceCommit: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const choice_0 = args_0[0];
    const salt_0 = args_0[1];
    const ownerKey_0 = args_0[2];
    const roundId_0 = args_0[3];
    if (!(typeof(choice_0) === 'boolean')) {
      __compactRuntime.typeError('choiceCommit',
                                 'argument 1',
                                 'nightflip.compact line 59 char 1',
                                 'Boolean',
                                 choice_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('choiceCommit',
                                 'argument 2',
                                 'nightflip.compact line 59 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    if (!(ownerKey_0.buffer instanceof ArrayBuffer && ownerKey_0.BYTES_PER_ELEMENT === 1 && ownerKey_0.length === 32)) {
      __compactRuntime.typeError('choiceCommit',
                                 'argument 3',
                                 'nightflip.compact line 59 char 1',
                                 'Bytes<32>',
                                 ownerKey_0)
    }
    if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('choiceCommit',
                                 'argument 4',
                                 'nightflip.compact line 59 char 1',
                                 'Uint<0..18446744073709551616>',
                                 roundId_0)
    }
    return _dummyContract._choiceCommit_0(choice_0,
                                          salt_0,
                                          ownerKey_0,
                                          roundId_0);
  },
  outcomeOf: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`outcomeOf: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const roundId_0 = args_0[0];
    const seed_0 = args_0[1];
    if (!(typeof(roundId_0) === 'bigint' && roundId_0 >= 0n && roundId_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('outcomeOf',
                                 'argument 1',
                                 'nightflip.compact line 68 char 1',
                                 'Uint<0..18446744073709551616>',
                                 roundId_0)
    }
    if (!(seed_0.buffer instanceof ArrayBuffer && seed_0.BYTES_PER_ELEMENT === 1 && seed_0.length === 32)) {
      __compactRuntime.typeError('outcomeOf',
                                 'argument 2',
                                 'nightflip.compact line 68 char 1',
                                 'Bytes<32>',
                                 seed_0)
    }
    return _dummyContract._outcomeOf_0(roundId_0, seed_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
