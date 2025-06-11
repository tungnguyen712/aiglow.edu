import Layout from "@/components/layouts";
import { Tab, TabItem } from "@/components/commons";
import PersonalInformation from "@/components/pages/Profile/Tabs/PersonalInformation";
import AccountSetting from "@/components/pages/Profile/Tabs/AccountSetting";

function Profile() {
    return (
        <Layout title="Profile" fullBackground={false}>
            <Tab>
                <TabItem title="Personal Information">
                    <PersonalInformation />
                </TabItem>
                <TabItem title="Account Setting">
                    <AccountSetting />
                </TabItem>
            </Tab>
        </Layout>
    )
}

export default Profile;