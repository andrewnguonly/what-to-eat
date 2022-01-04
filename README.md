# What to Eat?

An app for helping you decide what to eat, faster!

## Code Organization

As much as possible, code is organized according to the directory structure described in [this Medium article](https://medium.com/habilelabs/best-folder-structure-for-react-native-project-a46405bdba7).

## Development

### Setup

1. Follow the instructions on [this page](https://reactnative.dev/docs/environment-setup) for setting up a local development environment.
2. Install `yarn`: https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
3. Install `pre-commit`: https://pre-commit.com/#installation

### Commands

Run the following commands from the project's root directory.

Install project dependencies.

```
yarn install
```

Lint code.

```
yarn lint
```

Run tests.

```
yarn test
```

Compile Typescript.

```
yarn tsc
```

Run `pre-commit` hooks.

```
pre-commit run --all-files
```

### Running App (emulator)

Start Metro debugging session.

```
npx react-native start
```

Run app in emulator.

```
npx react-native run-ios
npx react-native run-android
```

## Build

### Update Build Version
1. Update app version. Example: 0.0.1 --> 0.0.2
2. Update build number. Example: 1 --> 2
3. `git tag -a v0.0.2 -m "<message>"`
4. `git push --tags`

### iOS

Build release version.

```
npx react-native run-ios --configuration Release
```

### Android

Build release version.

```
npx react-native run-android --variant=release
```

Generate release Android App Bundle.

```
cd android
./gradlew bundleRelease
```
