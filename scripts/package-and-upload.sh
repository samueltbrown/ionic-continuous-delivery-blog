#!/bin/sh
if [[ "$TRAVIS_BRANCH" != "$HOCKEYAPP_UPLOAD_BRANCH" ]]; then
  echo "This is not a deployment branch, skipping IPA build and upload."
  exit 0
fi

#####################
# Make the ipa file #
#####################
OUTPUTDIR="$PWD/platforms/ios/build/device"

xcrun -log -sdk iphoneos \
PackageApplication -v "$OUTPUTDIR/$APP_NAME.app" \
-o "$OUTPUTDIR/$APP_NAME.ipa"

/usr/bin/zip --verbose --recurse-paths "$OUTPUTDIR/$APP_NAME.dsym.zip" "$OUTPUTDIR/$APP_NAME.app.dsym"

#######################
# Upload to HockeyApp #
#######################
if [[ "$TRAVIS_BRANCH" == "$HOCKEYAPP_UPLOAD_BRANCH" ]]; then
  if [[ -z "$HOCKEY_APP_ID" ]]; then
    echo "Error: Missing HockeyApp ID"
    exit 1
  fi

  if [[ -z "$HOCKEY_APP_TOKEN" ]]; then
    echo "Error: Missing HockeyApp Token"
    exit 1
  fi

  echo "At $HOCKEYAPP_UPLOAD_BRANCH branch, upload to hockeyapp."
  curl https://rink.hockeyapp.net/api/2/apps/$HOCKEY_APP_ID/app_versions/upload \
    -F status="2" \
    -F notify="0" \
    -F notes="$DELIVER_WHAT_TO_TEST" \
    -F ipa="@$OUTPUTDIR/$APP_NAME.ipa" \
    -F dsym="@$OUTPUTDIR/$APP_NAME.dsym.zip" \
    -F commit_sha="$TRAVIS_COMMIT" \
    -H "X-HockeyAppToken: $HOCKEY_APP_TOKEN"

  if [[ $? -ne 0 ]]; then
    echo "Error: Fail uploading to HockeyApp"
    exit 1
  fi
fi
