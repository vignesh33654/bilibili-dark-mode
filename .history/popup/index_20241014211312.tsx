import React from 'react'
import { useStorage } from '@plasmohq/storage/hook'
import '@radix-ui/themes/styles.css'
import './index.css'
import { Container, Text, Flex, Heading, SegmentedControl, Theme, Card } from '@radix-ui/themes'

function IndexPopup() {
  const [darkBirdeyeToggle] = useStorage<boolean>('darkBirdeyeToggle')
  const [darkBirdeyeMode, setDarkBirdeyeMode] = useStorage<string>('darkBirdeyeMode')

  const modeChanged = function (mode: string) {
    setDarkBirdeyeMode(mode)

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { darkBirdeyeMode: mode })
    })
  }

  return (
    <Theme appearance="dark">
      <Container p="3" style={{ width: '280px', backgroundColor: 'var(--gray-a2)' }}>
        <Heading size="4" align="center">
          Dark mode
        </Heading>
        <Text as="p" align="center" size="1" color="gray" my="3">
          Perfered method
        </Text>
        <Card>
          <Flex my="2" justify="center">
            <Text as="label" size="2" align="center">
              <Flex align="center" gap="2">
                <SegmentedControl.Root
                  size="1"
                  value={
                    darkBirdeyeMode || (typeof darkBirdeyeToggle === 'undefined' ? 'dark' : darkBirdeyeToggle ? 'dark' : 'light')
                  }
                  onValueChange={(value) => modeChanged(value)}>
                  <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
                  <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
                  <SegmentedControl.Item value="system">System</SegmentedControl.Item>
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