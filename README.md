# 판다 어드민 대시보드 (Fanda Admin Dashboard)

농산물 거래 플랫폼 '판다'의 관리자 대시보드입니다. 회원, 상품, 거래액, 마일리지 등의 현황을 실시간으로 모니터링할 수 있습니다.

## 주요 기능

- **실시간 통계 현황**
  - 회원 현황 (총 회원수, 신규 가입자 등)
  - 상품 현황 (등록 상품, 신규 등록 등)
  - 거래액 현황 (총 거래액, 일별/주별/월별 거래액)
  - 마일리지 현황 (총 마일리지, 사용량 등)

- **데이터 시각화**
  - 거래/마일리지 통계 그래프 (월별/주별/일별)
  - 회원/상품 현황 그래프 (월별/주별/일별)
  - 실시간 알림 시스템

## 기술 스택

- **Frontend**
  - Next.js 15
  - React 19
  - TypeScript
  - TailwindCSS
  - ApexCharts

- **Backend**
  - Prisma
  - NextAuth.js

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/ugpapa/fanda-admin.git

# 디렉토리 이동
cd fanda-admin

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 배포

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 프로덕션 서버 시작
npm run start
# 또는
yarn start
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

- 개발자: @ugpapa
- 프로젝트 링크: https://github.com/ugpapa/fanda-admin
