### public
: 필요한 png 파일이 들어 있습니다, 프로젝트 내에서 '/파일명.png' 로 접근할 수 있습니다

### src/components 
: 버튼, 인풋 등 컴포넌트 파일이 들어감 ex) Button.tsx, Input.tsx, Menu.tsx, ... (파일명에 stories가 붙는 파일들은 아닙니다)
npm run storybook으로 파일별 컴포넌트들을 확인하실 수 있습니다

### src/pages 
: 구현될 페이지 파일들이 들어감 ex) Home.tsx, Onboarding.tsx, ...

### src/utils 
: 사용할 함수를 정의할 파일들이 들어감 ex) Login.tsx

### src/stores
: 전역 상태를 정의해둔 파일들이 들어감, 유저 관련 / 알람 / 그룹 정보를 여기서 꺼내 쓰시면 됩니다!
