import {useTheme} from 'styled-components';
import { HiOutlineUserGroup } from "react-icons/hi2";
import {Modal} from '../components/Modal';
import Button from '../components/Button';
import { getGroups } from '../utils/set_setting';
import {useState, useEffect} from 'react';
import { userStore } from '../stores/UserStore';

type Group = {
    group_id: string,
    group_name: string,
    invite_code: string,
    joined_at: string
}

interface IGroupName {
    name: string,
}

function GroupNameContainer({name}:IGroupName) {
    const theme = useTheme();
    return (
        <div style={{width: '100%', backgroundColor: theme.white, borderRadius: 15, border: '1px solid rgba(42, 50, 71, 0.3)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', padding: '11px 14px', marginBottom: 8}}>
                <span style={{color: theme.GreyText, fontSize: 16, display: 'flex', alignItems: 'center'}}>{name}</span>
                <button style={{border: theme.GreyText, backgroundColor: 'rgba(42, 50, 71, 0.4)', borderRadius: 18.5, padding: '5px 19px', color: theme.white, fontSize: 14, fontWeight: 700, cursor: 'pointer'}}>삭제</button>
        </div>
    )
}

interface IGroupCode {
    code: string,
}

function GroupCodeContainer({code}:IGroupCode) {
    const theme = useTheme();
    const onClick = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert('코드가 복사되었습니다!'); // 복사 완료 안내
            })
            .catch(() => {
                alert('복사 실패!'); // 오류 처리
            });
    }
    return (
        <div style={{width: '100%', backgroundColor: theme.white, borderRadius: 15, border: '1px solid rgba(42, 50, 71, 0.3)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxSizing: 'border-box', padding: '11px 14px', marginBottom: 16}}>
                <span style={{color: theme.GreyText, fontSize: 16, display: 'flex', alignItems: 'center'}}>{code}</span>
                <button style={{border: theme.GreyText, backgroundColor: 'rgba(42, 50, 71, 0.4)', borderRadius: 18.5, padding: '5px 19px', color: theme.white, fontSize: 14, fontWeight: 700, cursor: 'pointer'}} onClick={onClick}>복제</button>
        </div>
    )
}

function Setting_Group_Default() {
    const theme = useTheme();
    const accessToken = userStore((state) => state.accessToken);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getGroups(accessToken);
            console.log(data);
            setGroups([...data]);
        }
        fetchData();
    }, [])

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <HiOutlineUserGroup size={30} color={theme.GreyText} style={{marginBottom: 54}}/>
            <Modal style={{backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
                <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700, marginBottom: 24}}>현재 내가 소속된 그룹</span>
                {groups.map(group => (
                    <div>
                        <GroupNameContainer name={group.group_name} />
                        <GroupCodeContainer code={group.invite_code}/>
                    </div>
                ))}
            </Modal>
        </div>
    )
}

export default Setting_Group_Default;