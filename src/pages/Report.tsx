// src/pages/Report.tsx

import styled from 'styled-components';

interface ReportProps {
  onClose: () => void;
}

const dummySleepData = [
  { day: '일', time: '01:28', achieved: true },
  { day: '월', time: '01:32', achieved: false },
  { day: '화', time: '00:36', achieved: true },
  { day: '수', time: '00:01', achieved: true },
  { day: '목', time: '02:20', achieved: false },
  { day: '금', time: '01:15', achieved: true },
  { day: '토', time: '', achieved: null },
];

export default function Report({ onClose }: ReportProps) {
  const achieved = dummySleepData.filter((d) => d.achieved === true).length;
  const total = dummySleepData.filter((d) => d.achieved !== null).length;
  const rate = total > 0 ? Math.round((achieved / total) * 100) : 0;

  return (
    <Overlay>
      <Header>
        <BackButton onClick={onClose}>{'<'}</BackButton>
        <Title>리포트</Title>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Header>

      <IconArea>📋</IconArea>

      <Card>
        <CardTitle>이번 주 수면 현황</CardTitle>
        <Table>
          <tbody>
            {dummySleepData.map((row) => (
              <tr key={row.day}>
                <DayCell>{row.day}</DayCell>
                <TimeCell>{row.time !== '' ? row.time : ''}</TimeCell>
                <StatusCell>
                  {row.time !== '' && row.achieved !== null ? (
                    row.achieved ? (
                      <OText>O</OText>
                    ) : (
                      <XText>X</XText>
                    )
                  ) : (
                    ''
                  )}
                </StatusCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardRow>
          <CardTitle>목표 달성률</CardTitle>
          <RateText>약 {rate} %</RateText>
        </CardRow>
        <ProgressBarBg>
          <ProgressBarFill style={{ width: `${rate}%` }} />
        </ProgressBarBg>
      </Card>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  color: #1f2937;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  color: #1f2937;
`;

const IconArea = styled.div`
  text-align: center;
  font-size: 40px;
  margin: 8px 0 16px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CardTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const DayCell = styled.td`
  padding: 6px 8px;
  color: #1f2937;
  font-size: 14px;
  width: 40px;
`;

const TimeCell = styled.td`
  padding: 6px 8px;
  color: #1f2937;
  font-size: 14px;
`;

const StatusCell = styled.td`
  padding: 6px 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  width: 40px;
`;

const OText = styled.span`
  color: #e53935;
`;

const XText = styled.span`
  color: #1e88e5;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const RateText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

const ProgressBarBg = styled.div`
  background: #d0d0d0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  background: #e8e44a;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
`;
