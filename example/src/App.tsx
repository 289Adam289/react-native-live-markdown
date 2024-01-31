import * as React from 'react';

import {Button, Platform, StyleSheet, Text, View} from 'react-native';

import {MarkdownTextInput} from '@expensify/react-native-live-markdown';
import {TextInput} from 'react-native';

const DEFAULT_TEXT = ['bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg'].join('\n');

function isWeb() {
  return Platform.OS === 'web';
}

function getPlatform() {
  if (isWeb()) {
    return 'web';
  }
  // @ts-expect-error it works
  return Platform.constants.systemName || Platform.constants.Brand;
}

function getPlatformVersion() {
  return Platform.Version;
}

function getBundle() {
  return __DEV__ ? 'dev' : 'production';
}

function getRuntime() {
  if ('HermesInternal' in global) {
    const version =
      // @ts-expect-error this is fine
      // eslint-disable-next-line es/no-optional-chaining
      global.HermesInternal?.getRuntimeProperties?.()['OSS Release Version'];
    return `Hermes (${version})`;
  }
  if ('_v8runtime' in global) {
    // @ts-expect-error this is fine
    // eslint-disable-next-line no-underscore-dangle
    const version = global._v8runtime().version;
    return `V8 (${version})`;
  }
  return 'JSC';
}

function getArchitecture() {
  return 'nativeFabricUIManager' in global ? 'Fabric' : 'Paper';
}

function getReactNativeVersion() {
  const {major, minor, patch} = Platform.constants.reactNativeVersion;
  return `${major}.${minor}.${patch}`;
}

export default function App() {
  const [value, setValue] = React.useState(DEFAULT_TEXT);

  // TODO: use MarkdownTextInput ref instead of TextInput ref
  const ref = React.useRef<TextInput>(null);

  const onScroll = (e) => {
    console.log(e.nativeEvent.contentOffset);
  };

  return (
    <View style={styles.container}>
      <View style={styles.platform}>
        <Text>
          Platform: {getPlatform()} {getPlatformVersion()}
        </Text>
        <Text>Bundle: {getBundle()}</Text>
        {!isWeb() && (
          <>
            <Text>Architecture: {getArchitecture()}</Text>
            <Text>RN version: {getReactNativeVersion()}</Text>
            <Text>RN runtime: {getRuntime()}</Text>
          </>
        )}
      </View>
      {/* <Text>MarkdownTextInput singleline</Text>
      <MarkdownTextInput
        autoCapitalize="none"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      /> */}
      <Text>MarkdownTextInput multiline</Text>
      <MarkdownTextInput
        multiline
        autoCapitalize="none"
        // value={value}
        // onChangeText={setValue}
        style={styles.input}
        ref={ref}
        onScroll={onScroll}
      />
      {/* <Text>TextInput singleline</Text>
      <TextInput
        autoCapitalize="none"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      /> */}
      {/* <Text>TextInput multiline</Text>
      <TextInput
        multiline
        autoCapitalize="none"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      /> */}
      <Text style={styles.text}>{JSON.stringify(value)}</Text>
      <Button
        title="Focus"
        onPress={() => {
          if (!ref.current) {
            return;
          }
          ref.current.focus();
        }}
      />
      <Button
        title="Blur"
        onPress={() => {
          if (!ref.current) {
            return;
          }
          ref.current.blur();
        }}
      />
      <Button
        title="Reset"
        onPress={() => setValue(DEFAULT_TEXT)}
      />
      <Button
        title="Clear"
        onPress={() => setValue('')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  platform: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 20,
    width: 300,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top',
    maxHeight: 200,
  },
  text: {
    fontFamily: 'Courier New',
    marginTop: 10,
    height: 200,
  },
});
