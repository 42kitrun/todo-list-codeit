// next.config.ts
import { NextConfig } from "next";
import { Configuration, RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ... (기존 설정이 있다면 여기에 포함)

  webpack(
    config: Configuration, // config에 Webpack Configuration 타입 명시
    // 두 번째 매개변수 (options)는 필요 없으면 구조 분해 할당을 아예 안 하거나,
    // 필요하다면 { dev, isServer }와 같이 명시적으로 사용될 변수만 받습니다.
    // 여기서는 buildId, defaultLoaders, webpack 등을 사용하지 않으므로 아예 제거합니다.
    {}: {
      buildId: string;
      dev: boolean;
      isServer: boolean;
      defaultLoaders: object;
      webpack: typeof import("webpack"); // 'any' 대신 정확한 webpack 타입
    }
  ): // 실제로 사용하는 경우:
  // { dev, isServer }: { dev: boolean; isServer: boolean; }
  Configuration {
    // config.module과 config.module.rules가 존재하는지 확인하는 타입 가드 추가
    if (!config.module || !config.module.rules) {
      return config;
    }

    const fileLoaderRule = config.module.rules.find(
      (rule): rule is RuleSetRule => {
        // rule이 객체이고, test 속성이 존재하는 RuleSetRule 타입일 때만 true 반환
        return (
          typeof rule === "object" &&
          rule !== null &&
          "test" in rule &&
          rule.test instanceof RegExp &&
          rule.test.test(".svg")
        );
      }
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // @svgr/webpack 로더를 추가하여 SVG 파일을 React 컴포넌트로 변환합니다.
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
