import styled, {useTheme} from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import {useState} from 'react';
import {userStore} from '../stores/UserStore';
import { groupStore } from '../stores/GroupStore';
import {createGroup, joinGroup} from '../utils/set_setting';
import { IoIosSearch } from "react-icons/io";

const Modal = styled.div`
    background-color: ${props =>props.theme.ContentColor};
    border: 2px solid ${props => props.theme.BorderColor};
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    flex: 1;
    border-radius: 20px;
`;

const ScrollContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
`;

function Onboarding_Group(){
    const theme = useTheme();
    const [groupName, setGroupName] = useState('');
    const [maxNum, setMaxNum] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [groupComplete, setGroupComplete] = useState(false);
    const accessToken = userStore((state) => state.accessToken);

    const setGroup = groupStore((state) => state.setGroup);
    const setComplete = userStore((state) => state.setGroupComplete);
    const setInfo = groupStore((state) => state.setIdCode);
    const join = groupStore((state) => state.join);
    const id = groupStore((state) => state.groupId);
    const code = groupStore((state) => state.inviteCode);

    const onCreateClick = async () => {
        setGroup(groupName, Number(maxNum));
        const res = await createGroup(groupName, accessToken);
        console.log(res);
        if(res) {
            alert('그룹 생성 완료');
            setInfo(res.id, res.code);
            console.log(`state: ${id}, ${code}`)
            setGroupComplete(true);
            setComplete();
        }
        else alert('그룹 생성 중 오류 발생');
    }

    const onJoinClick = async () => {
        const res = await joinGroup(inviteCode, accessToken);
        if(res) {
            alert('그룹 가입 완료')
            join(inviteCode, res.name, res.id);
            console.log(`state: ${id}, ${code}`)
            setGroupComplete(true);
            setComplete();
        }
        else alert('그룹 가입 중 오류 발생');
    }

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 'calc(100vh - 220px)'}}>
            {
                groupComplete? 
                (
                    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <img src='/checkIcon.png'  style={{marginBottom: 8}}/>
                        <span style={{color: theme.white, fontSize: 12, fontWeight: 400}}>그룹을 성공적으로 생성했습니다.</span>
                    </div>
                ) : 
                (
                    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 16, height: 60}}>
                            <h2 style={{marginBottom: 5, textAlign: 'center', color: theme.btnColor, fontSize: 32, marginTop: 0}}>그룹 설정</h2>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{color: theme.white, fontSize: 12, textAlign:'center', width: '100%', marginBottom: 3}}>
                                    그룹 생성 및 초대 또는 그룹 가입
                                </span>
                            </div>
                        </div>
                        <ScrollContainer style={{overflowY: 'scroll', flex: 1}}>
                            <Modal style={{marginBottom: 20}}>
                                <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700, marginBottom: 10, display:'inline-block'}}>그룹 생성하기</span>
                                <Input placeholder='그룹명 입력' style={{backgroundColor: theme.white, marginBottom: 10}} value={groupName} onChange={(e:any) => setGroupName(e.currentTarget.value)}/>
                                <Input placeholder='최대 인원 수 입력' style={{backgroundColor: theme.white, marginBottom: 10}} value={maxNum} onChange={(e:any) => setMaxNum(e.currentTarget.value)}/>
                                <Button text='생성' onClick={onCreateClick}/>
                            </Modal>
                            <Modal>
                                <span style={{color: theme.btnColor, fontSize: 20, fontWeight: 700, marginBottom: 10, display:'inline-block'}}>그룹 가입하기</span>
                                <Input placeholder='초대 코드 입력' style={{backgroundColor: theme.white, marginBottom: 10}} value={inviteCode} onChange={(e:any) => setInviteCode(e.currentTarget.value)}/>
                                <div style={{width: '100%', position: 'relative', marginBottom: 10, boxSizing: 'border-box'}}>
                                    <Input placeholder='그룹명으로 찾기' style={{backgroundColor: theme.white, marginBottom: 0}} />
                                    <IoIosSearch style={{position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer'}} size={16.5} color={theme.GreyText}/>
                                </div>
                                <Button text='가입' onClick={onJoinClick}/>
                            </Modal>
                        </ScrollContainer>
                    </div>
                )
            }
        </div>
    )
}

export default Onboarding_Group;