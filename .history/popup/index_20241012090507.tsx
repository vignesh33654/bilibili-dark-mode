import React from 'react'
import { useStorage } from '@plasmohq/storage/hook'

import '@radix-ui/themes/styles.css'
import './index.css'
import { Container, Text, Flex, Heading, SegmentedControl, Theme, Link, Card } from '@radix-ui/themes'

function IndexPopup() {
  // for legacy config
  const [darkBiliToggle] = useStorage<boolean>('darkBiliToggle')

  // new config
  const [darkBiliMode, setDarkBiliMode] = useStorage<string>('darkBiliMode')

  const modeChanged = function (mode: string) {
    setDarkBiliMode(mode)

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { darkBiliMode: mode })
    })
  }

  return (
    <Theme appearance="dark">
      <Container p="3" style={{ width: '280px', backgroundColor: 'var(--gray-a2)' }}>
        <Heading size="4" align="center">
          DarkBili
        </Heading>
        <Text as="p" align="center" size="1" color="gray" my="3">
          Extension for the dark mode
        </Text>
        <Card>
          <Flex my="2" justify="center">
            <Text as="label" size="2" align="center">
              <Flex align="center" gap="2">
                <SegmentedControl.Root
                  size="1"
                  value={
                    darkBiliMode || (typeof darkBiliToggle === 'undefined' ? 'dark' : darkBiliToggle ? 'dark' : 'light')
                  }
                  onValueChange={(value) => modeChanged(value)}>
                  <SegmentedControl.Item value="dark"> auto </SegmentedControl.Item>
                  <SegmentedControl.Item value="light">light</SegmentedControl.Item>
                  <SegmentedControl.Item value="system">dark</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Flex>
            </Text>
          </Flex>
        </Card>
      </Container>
    </Theme>
  )
}

export default IndexPopup
